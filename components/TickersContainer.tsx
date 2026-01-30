import StockItem from "@/components/StockItem";
import { StockTicker, TickerContainerProps, TimedDataWithSymbol } from "@/Types/Types";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";


export default function TickersContainer({tickerType}:TickerContainerProps){
    let [symbolNames,setSymbolNames] = useState<string[]>([]);
    let [currPage,setCurrPage] = useState<number>(0);
    let [totalPages,setTotalPages] = useState<number>(1);
    let [currTickers,setCurrTickers] = useState<StockTicker[]>([]);
    let [fetching,setFetching] = useState<boolean>(false);
    const pageSize :number = 5;
    const namesCSV = currTickers.map(x => x.symbol).join(",");
    useEffect(() => {
        const fetchStockSymbols = async function(){
            setFetching(true);
            const uri = "http://10.0.0.5:5008/api/v1/tickers/" + tickerType + "/symbolnames";
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
            const uri = "http://10.0.0.5:5008/api/v1/tickers/" + tickerType + "/symbols/" + symbols;
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
                //setFetching(false);
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
        if(namesCSV === "")
            return;
        async function fetchPrices(abortSignal:AbortSignal){
            try{
                const uri:string = `http://10.0.0.5:5008/api/v1/tickers/${tickerType}/prices/${namesCSV}`;
                const resp = await fetch(uri,{
                    signal: abortSignal
                });
                const timedPrices:TimedDataWithSymbol[] = await resp.json();
                console.log(`resp = ${JSON.stringify(timedPrices)}`);
                const symDict:Map<string,number> = new Map<string,number>();
                for(let tp of timedPrices){
                    symDict.set(tp.symbol,tp.price);
                }
                for(let tp of timedPrices){
                    console.log(symDict.get(tp.symbol));
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
            console.log(`supposed to be unmounting...`);
            controller.abort();
            if(intervalId){
                clearInterval(intervalId);}
            }
    },[namesCSV]);

    return(
        <View className="flex-1 justify-between mt-2 w-full h-full bg-white items-center">
            {!fetching ? 
                (<View className="bg-whites gap-y-2 ">
                {
                    currTickers.map(ticker => {
                        return <StockItem 
                            symbol={ticker.symbol}
                            longName={ticker.longName}
                            key={ticker.symbol}
                            assetType={ticker.tickerType}
                            price={ticker.price}
                        ></StockItem>
                        }
                    )
                }
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