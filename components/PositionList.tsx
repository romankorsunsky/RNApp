import { API_BASE_URL } from "@/contexts/AuthContext";
import { PositionListProp } from "@/Types/Types";
import { View } from "react-native";
import PositionItem from "./PositionItem";

export default function PositionsList({positions,ptfId}:PositionListProp){
    const posCloseUri:string = API_BASE_URL + "portfolios/" + ptfId + "/positon-close";

    return (
    <View style={{
        backgroundColor: "white",
        borderRadius: 8,
        justifyContent: "center",
        alignContent: "center"
    }}>
        {positions.map(position => {
            return <PositionItem 
                position={position}
                ptfId={ptfId}
                key={position.Symbol}>    
                </PositionItem>
        })}
    </View>
    );
}