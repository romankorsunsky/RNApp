import StockItem from "@/components/StockItem";
import { StockTicker } from "@/Types/Types";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";


export default function Stocks({props}:any){
    let [symbolNames,setSymbolNames] = useState<string[]>([]);
    let [currPage,setCurrPage] = useState<number>(0);
    let [totalPages,setTotalPages] = useState<number>(1);
    let [currTickers,setCurrTickers] = useState<StockTicker[]>([]);
    let [fetching,setFetching] = useState<boolean>(false);
    const pageSize :number = 5;
    
    
    async function fetchTickers(symbols:string | null,signal:AbortSignal){
        const uri = "http://10.0.0.5:5008/api/v1/tickers/stock/symbols/" + symbols;
        try{
            const resp = await fetch(uri,{signal:signal});
            console.log(resp);
            let processed: StockTicker[] = await resp.json();
            return processed;
        }
        catch ({name,message}:any){
            if(name === 'AbortError'){
                console.log("fetch aborted");
            }
            console.error(message);
        }
    }

    async function loadNewTickers(page:number,signal:AbortSignal){
        setFetching(true);
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
        let newTickers = await fetchTickers(symbols.join(","),signal);
        if(!(newTickers === undefined)){
            setCurrTickers(newTickers);
        }
        setFetching(false);
    }

    useEffect(() => {
        const controller: AbortController = new AbortController();
        const fetchStockSymbols = async function(){
            setFetching(true);
            const uri = "http://10.0.0.5:5008/api/v1/tickers/stock/symbolnames";
            try {
                let length:number = 0;
                const resp = await fetch(uri);
                const processed:string[] = await resp.json()
                length = processed.length;
                let total_pages:number = Math.ceil(length / pageSize);
                setTotalPages(total_pages);  
                setSymbolNames(processed);  
            }
            catch (err:any) {
                console.error(err);
            }
        }
        fetchStockSymbols();
        return () => {
            controller.abort();
        }
     
    },[]); //this is done on mount cuz []
    
    useEffect(() => {
        const controller: AbortController = new AbortController();
        const signal:AbortSignal = controller.signal;
        if(symbolNames.length === 0)
            return;
        loadNewTickers(currPage,signal);
        return () => controller.abort();
    },[currPage, symbolNames]);


    return(
        <View className="flex-1 justify-between mt-2 w-full h-full bg-white items-center">
            {!fetching ? 
                (<View className="bg-whites gap-y-2 ">
                {
                    currTickers.map(ticker => {
                        return <StockItem symbol={ticker?.symbol}
                        longName={ticker?.longName}
                        price={42}
                        key={ticker?.symbol}
                        isUp={true}
                        ></StockItem>
                        }
                    )
                }
                </View>)
                 : 
                (<View className="justify-center items-center h-full">
                    <Text>LOADING..</Text>
                </View>)}
                <View className="w-full  bg-white flex-row gap-x-12 justify-center pb-10">
                    <Button onPress={()=> setCurrPage(currPage => currPage - 1)} title="Prev" disabled={currPage === 0}></Button>
                    <Button onPress={()=> setCurrPage(currPage => currPage + 1)} title="Next" disabled={currPage === totalPages - 1}></Button>
                </View>               
        </View>
    )
}