import ReportComponent from '@/components/ReportComponent';
import ThemedButton from '@/components/ThemedButton';
import { API_BASE_URL, AuthContext } from '@/contexts/AuthContext';
import { Report } from '@/Types/Types';
import { useRouter } from 'expo-router';
import { useContext, useRef, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '../../../global.css';
const stylez = StyleSheet.create({
    icon: {
        width: 80,
        height: 80
    }
})
enum DeliveryOption {
    MAIL = "mail",
    DEFAULT = "default"
}
const baseUri:string = `${API_BASE_URL}reports/annual?delivery=`;
export default function Login(props: any){
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const {login,logout,getProfile,loggedIn,fetchWrapper} = useContext(AuthContext);
    const image = require("@/assets/images/splash-icon.png");
    const [modalVisible,setModalVisible] = useState<boolean>(false);
    const reportRef = useRef<Report | null>(null);
    const router = useRouter();
    const reportUriRef = useRef<string>(baseUri + DeliveryOption.DEFAULT);

    const logIn = async () => {
        await login(email,password);
    }
    const changeEmail = (newVal:string) => {
        setEmail(newVal);
    }

    const changePwd = (newPwd:string) => {
        setPassword(newPwd);
    }
    function getReport(){
        async function doWork(){
            const request:Request = new Request(reportUriRef.current,{
                method: "GET"
            });
            try{
                const resp:Response = await fetchWrapper(request);
                if(resp.status !== 200){
                    alert("Failed to generate report");
                    console.log(resp.status);
                }
                else
                {
                    const reportData:Report = await resp.json();
                    reportRef.current = reportData;
                    setModalVisible(true);
                }
            }
            catch(e){
                if(e instanceof Error){
                    console.log("[LOG]" + e.message);
                }
            }
        }
        doWork();
    }
    function closeModal(): void {
        setModalVisible(false);
    }
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
                <Text className="text-white text-lg">{getProfile()?.firstName}</Text>
                <Text className="text-white text-lg">{getProfile()?.lastName}</Text>
                <Text className="text-white text-lg">{getProfile()?.email}</Text>
                <ThemedButton 
                    textColor="black"
                    textSize="2xl"
                    bgStyle="bg-white border-2 border-black rounded-xl bg-emerald-400 px-5"
                    text="Sign Out" onPress={() => logout()}
                ></ThemedButton>
            </View>
            <ThemedButton 
                    textColor="black"
                    textSize="2xl"
                    bgStyle="w-96 bg-white border-2 border-black rounded-xl bg-emerald-400 px-5 mt-8 h-20
                        justify-center"
                    text="GET REPORT" onPress={() => getReport()}
            ></ThemedButton>
            <Modal
                visible={modalVisible}
                onRequestClose={()=> setModalVisible(false)}
                animationType="slide"
                presentationStyle="pageSheet">
                    <ReportComponent 
                        closeModal={() => closeModal()}
                        report={reportRef.current}/> 
            </Modal>
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

