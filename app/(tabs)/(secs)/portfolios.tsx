import PortfolioCreator from "@/components/PortfolioCreator";
import PortfolioItem from "@/components/PortfolioItem";
import ThemedButton from "@/components/ThemedButton";
import { PortfolioContext } from "@/contexts/PortfolioContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import { Dimensions, Modal, ScrollView, Text, View } from "react-native";

const deviceWidth = Dimensions.get("screen").width;

export default function Portfolios(){
    const [modalVisible,setModalVisible] = useState<boolean>(false);
    const {portfolios,fetchPortfolios} = useContext(PortfolioContext);
    const [loading,setLoading] = useState<boolean>(true);
    
    function closeModal(): void {
        setModalVisible(false);
    }
    useEffect(() => {
        setLoading(false);
    },[portfolios])

    useFocusEffect(
        useCallback(() => {
            const controller:AbortController = new AbortController();

            async function load(){
                try{
                    await fetchPortfolios(controller.signal);
                }
                catch(e)
                {
                    //Noop
                }
            }
            load();
            return () => {
                controller.abort();
            };
        },[])
    )

    return (
        <View className="flex-1 w-full bg-white items-center">
            {!loading ? 
                (
                <View>
                    <ScrollView style={{
                        width: deviceWidth,
                    }}
                    showsVerticalScrollIndicator={false}>
                        <View style={{
                            width: deviceWidth
                        }}>
                            {
                                portfolios.map(p => {
                                    return <PortfolioItem 
                                        portfolioData = {p}
                                        closeModal={() => closeModal()}
                                        key = {p.id}>
                                    </PortfolioItem>
                                })
                            }
                        </View>
                    </ScrollView>
                    <View className="w-50">
                        <ThemedButton 
                            textColor="black"
                            textSize="2xl"
                            bgStyle="py-5 mt-4 w-full h-20 border-2 border-black rounded-xl bg-emerald-400 px-5"
                            text="ADD PORTFOLIO" onPress={() => setModalVisible(true)}
                        ></ThemedButton>
                    </View>
                    <Modal
                        visible={modalVisible}
                        onRequestClose={()=> setModalVisible(false)}
                        animationType="slide"
                        presentationStyle="pageSheet">
                            <PortfolioCreator closeModal={() => closeModal()}/> 
                    </Modal>
                </View>)
                 : 
                (
                    <View className="bg-white items-center">
                        <Text>LOADING...</Text>
                    </View>
                )}
        </View>
    )
}