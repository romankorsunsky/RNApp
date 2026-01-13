import { TimedPrice } from "@/Types/Types";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

export default function StockItem({longName,symbol}:any){
    let [price,setPrice] = useState<number>();
    let [isUp,setIsUp] = useState<boolean>(false);
    let [repeater,setRepeater] = useState<number>(0);
    let arrowSource = null;
    if(isUp)
        arrowSource = require("../assets/images/greenarrow.png")
    else
        arrowSource = require("../assets/images/redarrow.png")

    async function fetchPrice(){
        const uri:string = `http://10.0.0.5:5008/api/v1/tickers/stock/${symbol}/price`;
        const resp = await fetch(uri);
        const timedPrice:TimedPrice = await resp.json();
        return timedPrice;
    }

    useEffect(()=>{
        const driver = async function(){
            let p = await fetchPrice();
            setPrice(p.price);
            let rep= setInterval(async () => {
                let tp = await fetchPrice();
                setPrice(tp.price);
            },5000)
            setRepeater(rep);
        }
        driver();
        return () => { 
            if(repeater){
                clearInterval(repeater);}
            }
    },[]);
    return(
        <View className="w-96 bg-white border border-black border-2 rounded rounded-2xl flex-row justify-between
                        mx-5 my-4 p-2">
            <View>
                <View className="flex-row pt-2 items-center">
                    <Text className="text-black text-lg font-bold mr-2 justify-left">
                        {symbol}</Text>
                    <Image
                        source={arrowSource}
                        style={{width: 20,height: 20
                            }}
                    ></Image>
                </View>
                <Text className="text-bold text-black">{longName}</Text>
            </View>  
            <View className="bg-gray-950 rounded rounded-xl justify-center items-center pl-3">
                <Text className="text-white text-lg font-bold justify-right mr-2">${price?.toFixed(4)}</Text>
                <Text className="text-white text-xl font-bold mr-4"></Text>
            </View>
        </View>
    )
}