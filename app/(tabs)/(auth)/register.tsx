import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '../../../global.css';

export default function Register(props: any){
    const router = useRouter();
    return(
        <SafeAreaProvider>
            <SafeAreaView className="bg-green-400 h-20 items-center"> 
            </SafeAreaView>
            <View className="bg-white flex-1 items-center justify-center">
                <Text>Register</Text>
            </View>
        </SafeAreaProvider>
        
    )
}