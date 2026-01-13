import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const {user,logged} = useContext(AuthContext);
  let name = logged ? user?.fname : "John"
  const content = !logged ? (
    <View>
      <Text className="justify-center">Not logged</Text>
    </View>
  ):(
    <View>
      <Text className="justify-center">Hello {name}</Text>
    </View>
  );
  return (
    <SafeAreaProvider>
      <SafeAreaView  className="bg-green-400 h-20">
        
      </SafeAreaView>
      <View className="bg-white rounded flex-1 items-center justify-center">
        {content}
      </View>
    </SafeAreaProvider>
  );
}
