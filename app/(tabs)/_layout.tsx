import { Tabs } from "expo-router";
import { Image } from "react-native";


export default function TabsLayout(){
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor:"#68d391",
            tabBarInactiveTintColor: "white",
            tabBarStyle:{
                backgroundColor: "black",
                opacity: 0.7,
                height: 80,
                paddingTop: 15,
                borderRadius: 40,
                marginHorizontal:5,
                marginBottom: 5
            },
        }}>
            <Tabs.Screen
                name="(secs)"
                options={{
                    title:"Securities",
                    headerShown:false,
                    tabBarIcon:({focused}) => (
                        <Image
                            source={require("../../assets/images/stocks.png")}
                            style={{width: 30,height: 30,
                                tintColor: focused ? '#68d391': 'white'}}
                        ></Image>
                    )
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title:"Home",
                    headerShown:false,
                    tabBarIcon:({focused}) => 
                    (<Image 
                        source={require("../../assets/images/home.png")}
                        style={{width: 30,height: 30,tintColor: focused ? '#68d391': 'white'}}
                    ></Image>)
                }}
            />
            <Tabs.Screen
                name="(auth)"
                options={{
                    title:"Profile",
                    headerShown:false,
                    tabBarIcon:({focused}) => (
                        <Image
                            source={require("../../assets/images/prof.png")}
                            style={{width: 30,height: 30,tintColor: focused ? '#68d391': 'white'}}
                        ></Image>
                    )
                }}
            />
        </Tabs>
    )
}