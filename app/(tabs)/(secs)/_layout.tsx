import NavButton from "@/components/NavButton";
import { AuthContext } from "@/contexts/AuthContext";
import { PortfolioContextProvider } from "@/contexts/PortfolioContext";
import { Link, Redirect, Slot, usePathname } from "expo-router";
import { useContext } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function SecuritiesLayout(){
    const {loggedIn} = useContext(AuthContext)
    const portfolioImg = require("../../../assets/images/portfolio-icon.png")
    const pathname = usePathname();
    return(
        <PortfolioContextProvider>
        <SafeAreaProvider>
            <Redirect href={"/stocks"}></Redirect>
            <SafeAreaView className="items-center bg-green-400">
            </SafeAreaView>
            <View className="items-center flex-1 bg-green-400 ">
                <View className="bg-black w-xl w-11/12 rounded border-1 px-1 rounded-full mt-5 flex-row space-x-4 justify-around">
                    <NavButton href="/stocks" active={pathname === "/" || pathname === "/stocks"} label="STOCKS">
                    </NavButton>
                    <NavButton href="/fxs" active={pathname === "/fxs"} label="FOREX">
                    </NavButton>
                    <NavButton href="/etfs" active={pathname === "/etfs"} label="ETFS">
                    </NavButton>
                    
                    {loggedIn ?
                    <Link href="/portfolios" asChild>
                    <TouchableOpacity 
                        className="items-center justify-center rounded-3xl px-3"
                        style={{
                           backgroundColor:pathname === "/portfolios" ? 'white': 'black',
                        }}>
                        <Image 
                            source={portfolioImg}
                            style={{height: 30,
                            width: 30,
                            tintColor: pathname === "/portfolios" ? 'black': 'white'}}>
                            
                        </Image>
                    </TouchableOpacity>
                    </Link>
                     : null}
                </View>
                <Slot/>
            </View>
        </SafeAreaProvider>
        </PortfolioContextProvider>
    )
}