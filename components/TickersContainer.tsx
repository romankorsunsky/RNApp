/* eslint-disable react-hooks/exhaustive-deps */
import { API_BASE_URL } from "@/contexts/AuthContext";
import { StockTicker, TickerContainerProps, TimedDataWithSymbol } from "@/Types/Types";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Button, Modal, Text, View } from "react-native";
import StockItemExtended from "./StockItemExtended";
import StockItemWrapper from "./StockItemWrapper";


export default function TickersContainer({tickerType}:TickerContainerProps){
    const [symbolNames,setSymbolNames] = useState<string[]>([]);
    const [currPage,setCurrPage] = useState<number>(0);
    const [totalPages,setTotalPages] = useState<number>(1);
    const [currTickers,setCurrTickers] = useState<StockTicker[]>([]);
    const [fetching,setFetching] = useState<boolean>(false);
    const [modalVisible,setModalVisible] = useState<boolean>(false);
    
    const fullDataSymbolRef = useRef<string>("");

    const baseURI:string = API_BASE_URL + "tickers/";
    const pageSize:number = 5;
    const namesCSV:string = currTickers.map(x => x.symbol).join(",");
    const isFocused:boolean = useIsFocused();

    useEffect(() => {
        const fetchStockSymbols = async function(){
            setFetching(true);
            const uri = baseURI + tickerType + "/symbolnames";
            try {
                let length:number = 0;
                const resp = await fetch(uri);
                const symbols:string[] = await resp.json()
                length = symbols.length;
                let total_pages:number = Math.ceil(length / pageSize);
                setTotalPages(total_pages);  
                setSymbolNames(symbols);  
            }
            catch (err:any) {
                console.error(err);
            }
        }
        fetchStockSymbols();
    },[]);
    
    useEffect(() => {
        async function fetchTickers(symbols:string,signal:AbortSignal){
            const uri = baseURI + tickerType + "/symbols/" + symbols;
            try{
                const resp = await fetch(uri,{signal:signal});
                let processed: StockTicker[] = await resp.json();
                return processed;
            }
            catch ({name,message}:any){
                if(name === 'AbortError'){
                    console.error("fetch aborted");
                }
                console.error(message);
            }
        }
        async function loadNewTickers(page:number,signal:AbortSignal){
            let symbols: string[] = [];
            const shift = page * pageSize;
            for(let i = 0;i < pageSize; i++){
                let adjustedIndex = shift + i;
                let symbol = symbolNames.at(adjustedIndex);
                if (!(symbol === undefined)){
                    symbols.push(symbol);
                }
                else{
                    break;
                }
            }
            setFetching(true);
            let newTickers = await fetchTickers(symbols.join(","),signal);
            if(!(newTickers === undefined)){
                setCurrTickers(newTickers);
            }
        }
        const controller: AbortController = new AbortController();
        const signal:AbortSignal = controller.signal;

        if(symbolNames.length === 0)
            return () => controller.abort();

        loadNewTickers(currPage,signal);

        return () => controller.abort();
    },[currPage, symbolNames]);

    useEffect(() => {
        if(namesCSV === "" || !isFocused)
            return;
        async function fetchPrices(abortSignal:AbortSignal){
            try{
                const uri:string = `${baseURI}${tickerType}/prices/${namesCSV}`;
                const resp = await fetch(uri,{
                    signal: abortSignal
                });
                const timedPrices:TimedDataWithSymbol[] = await resp.json();
                const symDict:Map<string,number> = new Map<string,number>();
                for(let tp of timedPrices){
                    symDict.set(tp.symbol,tp.price);
                }
                setCurrTickers(previous => previous.map(x => {
                    if(symDict.has(x.symbol)) {
                        let newData: StockTicker = {
                            symbol: x.symbol,
                            longName: x.longName,
                            description: x.description,
                            tickerType: x.tickerType,
                            price: symDict.get(x.symbol)!,
                        }
                        return newData;
                    }
                    return x;
                }));
                setFetching(false);
            }
            catch(error:any){
                if(error instanceof Error){
                    console.log(error);
                }
            }
        }
        const controller: AbortController = new AbortController();
        const signal:AbortSignal = controller.signal;
        
        fetchPrices(signal);
        const intervalId = setInterval(() => 
            {
                fetchPrices(signal)
            },5000);
            
        return function cleanup() {
            controller.abort();
            if(intervalId){
                clearInterval(intervalId);}
            }
    },[namesCSV,isFocused]);

    const setModalInfo = async (symbol:string):Promise<void> => {
        fullDataSymbolRef.current = symbol;
        setModalVisible(true);
    }
    const closeModal = () => {
        setModalVisible(false);
    }
    return(
        <View className="flex-1 justify-between mt-2 w-full h-full bg-white items-center">
            {!fetching ? 
                (<View className="bg-whites gap-y-2 ">
                {
                    currTickers.map(ticker => {
                        return <StockItemWrapper
                            symbol={ticker.symbol}
                            longName={ticker.longName}
                            key={ticker.symbol}
                            price={ticker.price}
                            isUp={true}
                            setModalInfo={setModalInfo}
                        ></StockItemWrapper>
                        }
                    )
                }
                    <Modal
                        visible={modalVisible}
                        onRequestClose={()=> setModalVisible(false)}
                        animationType="slide"
                        presentationStyle="pageSheet">
                            <StockItemExtended 
                                symbol={fullDataSymbolRef.current}
                                tickerType={tickerType}
                                closeModal={() => closeModal()}/>
                    </Modal>
                </View>)
                 : 
                (<View className="justify-center items-center h-full">
                    <Text>LOADING..</Text>
                </View>)}
                <View className="w-full bg-white flex-row gap-x-12 justify-center pb-10">
                    <Button onPress={()=> setCurrPage(currPage => currPage - 1)} title="Prev" disabled={currPage === 0}></Button>
                    <Button onPress={()=> setCurrPage(currPage => currPage + 1)} title="Next" disabled={currPage === totalPages - 1}></Button>
                </View>               
        </View>
    )
}