import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import '../global.css';

export default function RootLayout() {
  
  return(
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{headerShown: false,
            contentStyle:{
              backgroundColor: "white"
            }
          }}
        />
      </Stack>
    </AuthProvider>
    )
  }
