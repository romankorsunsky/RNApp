import { StockItemProp } from "@/Types/Types";
import { Image, Text, View } from "react-native";

export default function StockItem({longName,symbol,price,isUp}:StockItemProp){
    let arrowSource = null;
    if(isUp)
        arrowSource = require("../assets/images/greenarrow.png")
    else
        arrowSource = require("../assets/images/redarrow.png")
    return(
            <View className="w-96 bg-white border-black border-2 rounded rounded-2xl flex-row justify-between
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
    )
}