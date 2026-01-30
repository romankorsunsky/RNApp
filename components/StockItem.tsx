import { StockItemProp } from "@/Types/Types";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function StockItem({longName,symbol,assetType,price}:StockItemProp){
    //const [price,setPrice] = useState<number>();
    const [isUp,setIsUp] = useState<boolean>(false);
    let arrowSource = null;
    const uri:string = `http://10.0.0.5:5008/api/v1/tickers/${assetType}/${symbol}/price`;
    if(isUp)
        arrowSource = require("../assets/images/greenarrow.png")
    else
        arrowSource = require("../assets/images/redarrow.png")
    /*
    useEffect(()=>{
        async function fetchPrice(){
        try{
            const uri:string = `http://10.0.0.5:5008/api/v1/tickers/${assetType}/${symbol}/price`;
            const resp = await fetch(uri);
            //console.log(`got status ${resp.status} for ${symbol}`);
            const timedPrice:TimedPrice = await resp.json();
            return timedPrice;
        }
        catch(e){
            const res: TimedPrice = {date:"00-00-0000",price:-1};
            return res;
        }
    }
        let repeater:any;
        const driver = async function(){
            const p = await fetchPrice();
            setPrice(p.price);
            let rep = setInterval(async () => {
                let tp = await fetchPrice();
                setPrice(tp?.price);
            },5000)
            repeater = rep;
        }
        driver();
        return () => { 
            if(repeater){
                clearInterval(repeater);}
            }
    },[]); */
    return(
        <TouchableOpacity>
            <View className="w-96 bg-white border border-black border-2 rounded rounded-2xl flex-row justify-between
                        mx-5 my-4 p-2">
                <View className="flex-1 mr-2">
                    <View className="flex-row pt-2 items-center">
                        <Text className="text-black text-lg font-bold mr-2 justify-left">
                            {symbol}</Text>
                        <Image
                            source={arrowSource}
                            style={{width: 20,height: 20
                                }}
                        ></Image>
                    </View>
                    <Text className="text-bold text-black" numberOfLines={1}>{longName}</Text>
                </View>  
                <View className="bg-gray-950 rounded rounded-xl justify-center items-center pl-3">
                    <Text className="text-white text-lg font-bold justify-right mr-2">${price?.toFixed(4)}</Text>   
                </View>
            </View>
        </TouchableOpacity>
        
    )
}