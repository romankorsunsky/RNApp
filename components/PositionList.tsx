import { PositionListProp } from "@/Types/Types";
import { ScrollView, View } from "react-native";
import PositionItem from "./PositionItem";

export default function PositionsList({positions,ptfId}:PositionListProp){
    return (
        <View style={{
        }}>
            <ScrollView style={{
                backgroundColor: "white",
                borderRadius: 8,
                }}
                contentContainerStyle={{
                    alignContent: "center",
                    justifyContent: "center",
                    paddingBottom:30
                }}
            >
                {positions.map(position => {
                    return <PositionItem 
                        position={position}
                        ptfId={ptfId}
                        key={position.id}>    
                        </PositionItem>
                })}
            </ScrollView>
        </View>
    
    );
}