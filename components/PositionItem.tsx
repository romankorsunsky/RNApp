import API_BASE from "@/config";
import { AuthContext } from "@/contexts/AuthContext";
import { PortfolioContext } from "@/contexts/PortfolioContext";
import { PositionItemProp } from "@/Types/Types";
import { useContext, useEffect } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const darkGrayBg:string = "#030712";
const emeraldBg:string = "#34D399";
const screenWidth:number = Dimensions.get("screen").width;
export default function PositionItem({position,ptfId}:PositionItemProp){
    const posCloseUriBase:string = `${API_BASE}portfolios/${ptfId}/position-close/`;
    const {fetchWrapper} = useContext(AuthContext);
    const {removePosition,portfolios} = useContext(PortfolioContext);

    function closePosition(){
        const uri = posCloseUriBase + position.id;
        const request: Request = new Request(uri,{
            method: "POST",
        });
        async function doWork(){
            const resp:Response = await fetchWrapper(request);
            if(resp.status !== 200){
                console.log(resp.status);
                alert("Sorry, try again later");
            }
            else{
                removePosition(ptfId,position.id);
            }
        }
        doWork();
    }
    useEffect(() => {
        console.log("Portfolios changed");
    },[portfolios])

    return (
        <View style={{
            backgroundColor: emeraldBg,
            borderBottomWidth: 2
        }}>
            <View style={{
                flexDirection: "row",
                height: 40,
                alignContent: "center",
            }}>
                <Text style={{
                    fontSize: 18,
                    color: "white",
                    backgroundColor: darkGrayBg,
                    borderRadius: 8,
                    margin: 4,
                    padding: 2,
                    textAlign: "center",
                    width: (screenWidth / 2.0) - 8.0
                }}>{"Symbol:" + position.symbol}</Text>
                <Text style={{
                    fontSize: 18,
                    color: "white",
                    backgroundColor: darkGrayBg,
                    borderRadius: 8,
                    margin: 4,
                    padding: 2,
                    textAlign: "center",
                    width: (screenWidth / 2.0) - 8.0
                }}>{"Price:" + position.price.toFixed(10)}</Text>
            </View>
            <View style={{
                flexDirection: "row",
                height: 40,
                alignContent: "center"
            }}>
                <Text style={{
                    fontSize: 18,
                    color: "white",
                    backgroundColor: darkGrayBg,
                    borderRadius: 8,
                    margin: 4,
                    padding: 2,
                    textAlign: "center",
                    width: (screenWidth / 3.0) - 8.0
                }}>{"Qtty:" + position.quantity}</Text>
                <Text style={{
                    fontSize: 18,
                    color: "white",
                    backgroundColor: darkGrayBg,
                    borderRadius: 8,
                    margin: 4,
                    padding: 2,
                    textAlign: "center",
                    width: (screenWidth / 3.0) - 8.0
                }}>{"Type:" + position.positionType}</Text>
                <TouchableOpacity style={
                    {
                        backgroundColor: "white",
                        borderRadius: 8,
                        margin: 4,
                        padding: 2,
                        width: (screenWidth / 3.0) - 8.0,
                        justifyContent: "center"
                    }}
                    onPress={() => closePosition()}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            textAlign: "center"
                        }}>{position.positionType === "SHORT" ?
                            "COVER" : "SELL"
                        }</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    
    )
}