import { NewsItemProps } from "@/Types/Types";
import { Text, View } from "react-native";


export default function NewsItemComponent({title,content}:NewsItemProps){
    return (
    <View style={{
        padding:2,
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: "#1c1c1c"}}>
        <View>
            <Text style={{fontWeight: "bold",color: "white"}}>
                {title}
            </Text>
        </View>
        <View style={{backgroundColor: "#91ff94",borderRadius: 8}}>
            <Text>
                {content}
        </Text>
        </View>
    </View>);
}