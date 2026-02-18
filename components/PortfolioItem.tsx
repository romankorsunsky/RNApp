import { PortfolioItemProps } from "@/Types/Types";
import { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import PositionsList from "./PositionList";

export default function PortfolioItem({portfolioData}:PortfolioItemProps){
    const ptfName: string = portfolioData.displayName;
    const portfolioType: string = portfolioData.portfolioType;
    const deviceWidth = Dimensions.get("screen").width;
    const [isExpanded,setIsExpanded] = useState<boolean>(false);

    function expandList(){
        setIsExpanded(isExpanded => !isExpanded);
    }
    return (
        <View style={{width: deviceWidth}}>
            <TouchableOpacity onPress={() => expandList()}>
                <View className="border-black border-t-2 border-b-2 flex-row justify-between
                            p-2">
                    <View className="flex-1 mr-2">
                        <View className="flex-row pt-2 items-center">
                            <Text className="text-black text-lg font-bold mr-2 justify-left">
                                {"NAME: " + ptfName}</Text>
                        </View>
                        <Text className="text-bold text-black" numberOfLines={1}>
                            {"TYPE: " + portfolioType}</Text>
                    </View>  
                </View>
            </TouchableOpacity>
            {isExpanded ? <PositionsList 
                ptfId={portfolioData.id} 
                positions={portfolioData.positions}>
            </PositionsList> :
            <></>}
        </View>
    );
}