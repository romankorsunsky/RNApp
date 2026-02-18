import { API_BASE_URL } from "@/contexts/AuthContext";
import { PositionItemProp } from "@/Types/Types";
import { Text, View } from "react-native";

export default function PositionItem({position,ptfId}:PositionItemProp){
    const posCloseUri:string = API_BASE_URL + "portfolios/" + ptfId + "/positon-close";

    return (
    <View style={{
        flexDirection: "row",
        height: 40,
        alignContent: "center"
    }}>
        <Text style={{
            fontSize: 18,
            backgroundColor: "#1a1b1c",
            color: "white",
            textAlign: "center"
        }}>{"Symbol:" + position.symbol}</Text>
        <Text>{"Qtty:" + position.quantity}</Text>
        <Text>{"Price:" + position.price.toFixed(10)}</Text>
    </View>
    )
}