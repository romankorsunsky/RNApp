import ThemedButton from "@/components/ThemedButton";
import { API_BASE_URL, AuthContext } from "@/contexts/AuthContext";
import { PortfolioContext } from "@/contexts/PortfolioContext";
import { Portfolio, PortfolioCreationRequest, PortfolioType } from "@/Types/Types";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Portfolios(){
    const {fetchWrapper} = useContext(AuthContext);
    const {addPortfolio} = useContext(PortfolioContext);
    const [ptfType,setPtfType] = useState<PortfolioType>(PortfolioType.REGULAR);
    const [name,setName] = useState<string>("");
    const router = useRouter();
    const addPortfolioRequest = async function(){
        const porfolioRequest:PortfolioCreationRequest = {
            DisplayName: name,
            PtfType: ptfType,
        };
        const body: string = JSON.stringify(porfolioRequest);
        const url = API_BASE_URL + `portfolios`;
        const request = new Request(url, {
            method: "POST",
            body: body,
        })
        try{
            const response = await fetchWrapper(request);
            if(response.status === 200){
                const portfolio: Portfolio = await response.json();
                addPortfolio(portfolio);
                router.replace("/(tabs)");
            }
            else{
                alert("Try Again Later, sorry!");
            }
        }
        catch(e){
            if(e instanceof Error){
                console.log(e.message);
                router.replace("/(tabs)");
            }
        }
    }
    const changeDisplayName = (value:string) => {
        setName(value);
    }
    const changeType = (value:string) => {
        if(value === "REGULAR"){
            setPtfType(PortfolioType.REGULAR);
            return;
        }
        setPtfType(PortfolioType.ADVANCED);
    }
    return(
        <View className="mt-2 w-full h-full bg-white pt-2 ">
            <View className="w-full px-8 items-center">
                <Text className="text-2xl text-bold pt-2 pb-6">CREATE NEW PORTFOLIO:</Text>
                <View className="w-full">
                    <Text className="text-xl w-full">SELECT DISPLAY NAME:</Text>
                    <TextInput className="w-full border-2 border-gray-400 p-2 my-4 rounded-xl text-xl focus:border-green-200" 
                        placeholder="New Portfolio Name"
                        placeholderTextColor={"gray"}
                        style={{color: 'black'}}
                        onChangeText={(value) => changeDisplayName(value)}
                        />
                    <Text className="text-xl pb-4">SELECT PORTFOLIO TYPE:</Text>
                </View>
                <View className="flex-row w-full p-2">
                    {
                        (ptfType === PortfolioType.REGULAR) ?
                        <View className="bg-black border-2 w-10 h-10 rounded-xl"/>
                        :
                        <View className="bg-white-200 border-2 w-10 h-10 rounded-xl"/>
                    }
                    <View className="h-10 ml-4">
                        <TouchableOpacity className="bg-blue h-10 items-center"
                            onPress={() => changeType(PortfolioType.REGULAR)}>
                            <Text className="text-2xl">REGULAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-row w-full p-2">
                    {
                        (ptfType === PortfolioType.ADVANCED) ?
                        <View className="bg-black border-2 w-10 h-10 rounded-xl"/>
                        :
                        <View className="bg-white-200 border-2 w-10 h-10 rounded-xl"/>
                    }
                    <View className="bg-red h-10 ml-4">
                        <TouchableOpacity className="bg-blue h-10 items-center" 
                            onPress={() => changeType(PortfolioType.ADVANCED)}>
                            <Text className="text-2xl">ADVANCED</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ThemedButton 
                    textColor="black"
                    textSize="2xl"
                    bgStyle="py-5 mt-4 w-full h-20 border-2 border-black rounded-xl bg-emerald-400 px-5"
                    text="CREATE PORTFOLIO" onPress={() => addPortfolioRequest()}
                ></ThemedButton>
            </View>
        </View>
    )
}