import ThemedButton from '@/components/ThemedButton';
import { AuthContext } from '@/contexts/AuthContext';
import { RegistrationForm } from '@/Types/Types';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '../../../global.css';

export default function Register(props: any){
    const {fetchWrapper} = useContext(AuthContext);
    const [username,setUsername] = useState<string | null>(null);
    const [email,setEmail] = useState<string | null>(null)
    const [firstname,setFirstname] = useState<string | null>(null);
    const [lastname,setLastname] = useState<string | null>(null)
    const [pwd,setPwd] = useState<string | null>(null);
    const [pwdcp,setPwdcp] = useState<string | null>(null)
    const router = useRouter();
    const changeUsername = function (value:string){
        setUsername(value);
    }
    const changeEmail = function (value:string){
        setEmail(value);
    }
    const changeFirstname = function (value:string){
        setFirstname(value);
    }
    const changeLastname = function (value:string){
        setLastname(value);
    }
    const changePassword = function (value:string){
        setPwd(value);
    }
    const changePasswordCopy = function (value:string){
        setPwdcp(value);
    }
    const register = async function (){
        if(username === null || pwd === null || pwdcp === null ||
            email === null || firstname === null || lastname === null)
        {
            alert("Missing Fields!");
            return;
        }
        //do more checks here, filtering out early is a good idiom, so we want to minimize checks on the backend
        //to minimize the resource allocation, on the other hand, I suck with react, and maybe doing everything in the front
        //will cause bad user experience so I will have to think about it (eventually :D).
        const regForm:RegistrationForm = {
            Username:username,
            Password:pwd,
            Email:email,
            FirstName:firstname,
            LastName:lastname
        }
        const formStr = JSON.stringify(regForm);
        console.log(`Registering with \n ${formStr}`)
        const request:Request = new Request(
            "http://10.0.0.5:5008/api/v1/users/register",
            {
                method: "POST",
                body: formStr,
            }
        )
        const res = await fetchWrapper(request);
        if(!res.ok){
            alert("Bad Registration.")
        }
        router.navigate("/");
    }
    return(
        <SafeAreaProvider>
            <SafeAreaView className="bg-green-400 h-20"> 
            </SafeAreaView>
            <View className="h-full bg-white items-center justify-center">
                <View className="w-11/12 bg-black rounded-3xl justify-center items-center p-6 mb-20">
                    <View className="w-full items-center justify-center">
                        <Text className="w-full text-white w-15 mx-5 my-2 text-2xl mb-2">Username:</Text>
                        <TextInput className="w-full border-2 border-gray-400 p-2 rounded-xl text-xl focus:border-green-200" 
                            placeholder="Your User Name"
                            placeholderTextColor={"gray"}
                            style={{color: 'white'}}
                            onChangeText={username => changeUsername(username)}></TextInput>
                    </View>
                    <View className="w-full items-center justify-center">
                        <Text className="w-full text-white w-15 mx-5 my-2 text-2xl mb-2">Email:</Text>
                        <TextInput className="w-full border-2 border-gray-400 p-2 rounded-xl text-xl focus:border-green-200" 
                            placeholder="Your Email"
                            placeholderTextColor={"gray"}
                            style={{color: 'white'}}
                            onChangeText={email => changeEmail(email)}></TextInput>
                    </View>
                    <View className="w-full items-center justify-center">
                        <Text className="w-full text-white w-15 mx-5 my-2 text-2xl mb-2">Password:</Text>
                        <TextInput className="w-full border-2 border-gray-400 p-2 rounded-xl text-xl focus:border-green-200" 
                            placeholder="Your Password"
                            placeholderTextColor={"gray"}
                            style={{color: 'white'}}
                            onChangeText={pwd => changePassword(pwd)}
                            secureTextEntry></TextInput>
                    </View>
                    <View className="w-full items-center justify-center">
                        <Text className="w-full text-white w-15 mx-5 my-2 text-2xl mb-2">Password Copy:</Text>
                        <TextInput className="w-full border-2 border-gray-400 p-2 rounded-xl text-xl focus:border-green-200" 
                            placeholder="Your Password Again"
                            placeholderTextColor={"gray"}
                            style={{color: 'white'}}
                            onChangeText={pwdcp => changePasswordCopy(pwdcp)}
                            secureTextEntry></TextInput>
                    </View>
                    <View className="w-full items-center justify-center">
                        <Text className="w-full text-white w-15 mx-5 my-2 text-2xl mb-2">First Name:</Text>
                        <TextInput className="w-full border-2 border-gray-400 p-2 rounded-xl text-xl focus:border-green-200" 
                            placeholder="Your First Name"
                            placeholderTextColor={"gray"}
                            style={{color: 'white'}}
                            onChangeText={firstname => changeFirstname(firstname)}></TextInput>
                    </View>
                    <View className="w-full items-center justify-center">
                        <Text className="w-full text-white w-15 mx-5 my-2 text-2xl mb-2">Last Name:</Text>
                        <TextInput className="w-full border-2 border-gray-400 p-2 rounded-xl text-xl focus:border-green-200" 
                            placeholder="Your Last Name"
                            placeholderTextColor={"gray"}
                            style={{color: 'white'}}
                            onChangeText={lastname => changeLastname(lastname)}></TextInput>
                    </View>
                    <ThemedButton
                        bgStyle="w-full h-14 mb-5 border-2 border-black rounded-xl bg-green-400 justify-center mt-4"
                        text="S I G N     U P" 
                        textColor="black"
                        textSize="2xl"
                        onPress={() => register()} props={props}></ThemedButton>
                </View>
            </View>
        </SafeAreaProvider>
        
    )
}