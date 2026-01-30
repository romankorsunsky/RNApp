import ThemedButton from '@/components/ThemedButton';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '../../../global.css';
const stylez = StyleSheet.create({
    icon: {
        width: 80,
        height: 80
    }
})

export default function Login(props: any){
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const {login,logout,profile,loggedIn,} = useContext(AuthContext);
    const [image,setImage] = useState<any>(null);
    useEffect(() => {
        const img = require("@/assets/images/splash-icon.png");
        setImage(img);
    },[])

    const logIn = async () => {
        await login(email,password)
        if(loggedIn){
            router.navigate("/");
        }
    }
    const changeEmail = (newVal:string) => {
        setEmail(newVal);
    }

    const changePwd = (newPwd:string) => {
        setPassword(newPwd);
    }
    const router = useRouter();
    const content = (loggedIn === false) ? (
        <>
            <View className="justify-center items-center mb-10">
                <Image 
                style={stylez.icon}
                source={image}
                />
            </View>
            <View className="rounded-xl h-14 justify-center items-center mb-5">
                <Text className="justify-center font-bold  text-black text-base text-lg">
                    Login into your account:
                </Text>
            </View>
            <View className="w-11/12 bg-black rounded-3xl justify-center items-center p-10">
                <View className="w-full items-center justify-center">
                    <Text className="w-full text-white w-15 mx-5 my-2 text-2xl mb-2">Username:</Text>
                    <TextInput className="w-full border-2 border-gray-400 p-2 rounded-xl text-xl focus:border-green-200" 
                        placeholder="Your Username"
                        placeholderTextColor={"gray"}
                        style={{color: 'white'}}
                        onChangeText={text => changeEmail(text)}></TextInput>
                </View>
        
                <View className="w-full items-center justify-center pb-10">
                    <Text className="w-full text-white w-15 mx-5 my-2 text-2xl mb-2">Password:</Text>
                    <TextInput className="w-full border-2 border-gray-400 p-2 rounded-xl text-xl focus:border-green-200"
                    secureTextEntry 
                    placeholder="Your Password"
                    placeholderTextColor={"gray"}
                    style={{color: 'white'}}
                    onChangeText={text => changePwd(text)}></TextInput>
                </View>
                <ThemedButton
                        bgStyle="w-full h-14 mb-5 border-2 border-black rounded-xl bg-green-400 justify-center"
                        text="S I G N     I N" 
                        textColor="black"
                        textSize="2xl"
                        onPress={() => logIn()} props={props}></ThemedButton>

                <View className="items-center flex-row justify-center">
                    <Text className="pr-5 text-white">Not Registered ?</Text>
                    <ThemedButton
                        textColor="black"
                        textSize="2xl"
                        bgStyle="bg-white border-2 border-black rounded-xl bg-emerald-400 px-5"
                        text="Sign Up" onPress={() => router.navigate("/register")}></ThemedButton>
                </View>
            </View>
            </>
    ):(
        <>
            <View className="w-11/12 bg-gray-950 rounded-3xl justify-center items-center p-10">
                <Text className="text-white text-lg">{profile?.firstName}</Text>
                <Text className="text-white text-lg">{profile?.lastName}</Text>
                <Text className="text-white text-lg">{profile?.email}</Text>
                <ThemedButton 
                    textColor="black"
                    textSize="2xl"
                    bgStyle="bg-white border-2 border-black rounded-xl bg-emerald-400 px-5"
                    text="Sign Out" onPress={() => logout()}
                ></ThemedButton>
            </View>
        </>
    )

    return (
        <SafeAreaProvider>
            <SafeAreaView className="bg-green-400 h-20 items-center justify-center">
            </SafeAreaView>
            <View className="bg-white flex-1 pt-12 items-center">
                {content}
            </View>
        </SafeAreaProvider>
    )
    
}