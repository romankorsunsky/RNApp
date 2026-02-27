import { ReportModalProps } from "@/Types/Types";
import { ScrollView, Text, View } from "react-native";
import ThemedButton from "./ThemedButton";

export default function ReportComponent({closeModal,report}:ReportModalProps){
    return (
        <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center"
            }}>
                <View style={{
                    paddingTop: 32
                }}>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 6
                    }}>
                        <Text style={{fontSize:18}}>{"Current Balance : "}</Text>
                        <Text style={{
                                fontWeight: "bold",
                                fontSize : 20
                            }}
                            >{report?.currentBalance.toPrecision(12)}</Text>
                    </View>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 6
                    }}>
                        <Text style={{fontSize:18}}>{"Portfolios Worth : "}</Text>
                        <Text style={{
                                fontWeight: "bold",
                                fontSize : 20
                            }}
                            >{report?.totalPortfoliosWorth.toPrecision(12)}</Text>
                    </View>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 6
                    }}>
                        <Text style={{fontSize:18}}>{"Open Short Positions : "}</Text>
                        <Text style={{
                                fontWeight: "bold",
                                fontSize : 20
                            }}
                            >{report?.openShortPositionsCount}</Text>
                    </View>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 6
                    }}>
                        <Text style={{fontSize:18}}>{"Open Long Positions : "}</Text>
                        <Text style={{
                                fontWeight: "bold",
                                fontSize : 20
                            }}
                            >{report?.openLongPositionsCount}</Text>
                    </View>
                    <View style={{
                        backgroundColor: "#1c1c1c",
                        height: 40,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text style={{
                            fontSize: 20,
                            color: "white"
                        }}
                        >{"GAINS PER SYMBOL:"}</Text>
                    </View>
                    
                    {report?.perAssetGain.map((ag => {
                        return (<View style={{
                            marginTop: 6,
                            borderRadius: 8,
                            borderWidth: 2,
                            borderCurve: "circular"
                        }}
                        key={ag.assetName}
                        >
                            <View style={{
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <Text style={{
                                    fontSize:18
                                }}
                                >{"Symbol: "}</Text>
                                <Text style={{
                                        fontWeight: "bold",
                                        fontSize : 20
                                    }}
                                    >{ag.assetName.padEnd(12," ")}</Text>
                            </View>
                            <View className="flex-row">
                                <Text style={{
                                    fontSize:18
                                }}
                                >{"Gain: "}</Text>
                                <Text style={{
                                        fontWeight: "bold",
                                        fontSize: 18
                                    }}
                                    >{ag.gain.toPrecision(5)}</Text>
                            </View>
                        </View>);
                    }))}                   
                </View>
                <ThemedButton 
                    textColor="black"
                    textSize="2xl"
                    bgStyle="py-5 mt-4 w-96 h-20 border-2 border-black rounded-xl bg-emerald-400 px-5"
                    text="GO BACK" onPress={() => closeModal()}
                ></ThemedButton>
        </ScrollView>
    );
}