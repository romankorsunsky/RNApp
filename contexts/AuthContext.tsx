import { AuthState, User } from "@/Types/Types";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useState } from "react";


const dummyUser: User = {id:"0",fname:"Gandalf",lname:"The White",email:"gandalf@rivendell.com"}


export const AuthContext = createContext<AuthState>(
    {
        logged:false,
        user:dummyUser,
        login: (email:string,password:string) => {},
        logout: () => {}
    }
)

export function AuthProvider({children} : PropsWithChildren){
    let [logged,setLogged] = useState(false);
    let [user,setUser] = useState<User | null>(null!);
    const router = useRouter();
    const login = (username:string, pwd:string) =>
    {   
        console.log("Got:" + username + "," + pwd);
        const usr:User = {id:"123",fname:"Frodo",lname:"Baggins",email:"frodo@shire.com"}
        setUser(usr)
        if(username === "admin" && pwd === "123456"){
            router.navigate("/(tabs)");
            setLogged(true);
        }
    }
    const logout = () =>
    {
        setUser(null);
        console.log("Logged out.")
        setLogged(false);
    }
    return(
        <AuthContext.Provider value={{logged,user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}