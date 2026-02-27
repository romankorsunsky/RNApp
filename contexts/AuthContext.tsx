import { AuthenticationRequest, AuthenticationResponse, AuthState, Profile } from "@/Types/Types";
import * as SecureStore from 'expo-secure-store';
import { createContext, PropsWithChildren, useEffect, useRef, useState } from "react";
import API_BASE from '../config';
export const AuthContext = createContext<AuthState>(
    {
        getProfile: () => {throw new Error("Not initialized")},
        login: async (username:string,password:string) => {
            throw new Error("Not Initialized Auth Context");
         },
        logout: () => {},
        fetchWrapper: async () => {throw new Error("Not Initialized Auth Context")},
        loggedIn: false,
    }
)
export const API_BASE_URL:string = API_BASE;

const profileKey = "profile";
const accessTokenKey = "access-token";
const idTokenKey = "id-token";

export function AuthProvider({children} : PropsWithChildren){
    const profileRef = useRef<Profile | null>(null);
    const accessTokenRef = useRef<string | null>(null);
    const [loggedIn,setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const initToken = async function(){
            try{ //try to get tokens from Secure Store
                const accessTok = await SecureStore.getItemAsync(accessTokenKey);
                const idTok = await SecureStore.getItemAsync(idTokenKey);
                if(idTok !== null)
                    accessTokenRef.current = accessTok;
                const res = await SecureStore.getItemAsync(profileKey);
                if(res !== null)
                    profileRef.current = JSON.parse(res);
            }
            catch (error){
                if(error instanceof Error){
                    console.log("couldn't init tokens");
                }
            }
        }
        initToken();
    },[])

    const getProfile = () => {
        return profileRef.current;
    }
    const login = async (username:string, pwd:string) =>
    {   
        const authVal: AuthenticationRequest = {Username:username,Password:pwd};
        const body = JSON.stringify(authVal);
        const request = new Request(
            API_BASE_URL + "users/login",{
            method: "POST",
            body: body,
        });
        const response = await fetchWrapper(request);
        if(response.status !== 200){
            alert("Failed Login");
            return;
        }
        try{
            const token:AuthenticationResponse = await response.json();
            
            accessTokenRef.current = token.accessToken;
            console.log('token = ' + accessTokenRef.current);
            const profileReq = new Request(API_BASE_URL + "users/profile",{
                method: "GET"
            });
            const profileResponse = await fetchWrapper(profileReq);
            const prof:Profile = await profileResponse.json();
            await SecureStore.setItemAsync(accessTokenKey,token.accessToken);
            profileRef.current = prof;
            setLoggedIn(true);
        }
        catch(error){
            if(error instanceof Error){
                console.log(error);
            }
        }
    }
    const logout = async () =>
    {
        setLoggedIn(false);
        accessTokenRef.current = null;
        await SecureStore.deleteItemAsync(accessTokenKey);
        await SecureStore.deleteItemAsync(idTokenKey);
        await SecureStore.deleteItemAsync(profileKey);
    }
    const fetchWrapper = async function (request: Request): Promise<Response>{
        if(accessTokenRef.current !== null){
            let bearer = "Bearer " + accessTokenRef.current;
            request.headers.set("Authorization",bearer);
        }
        if(request.method === "POST")
            request.headers.set("Content-Type","application/json")
        const response = await fetch(request);
        return response;
    }
    return(
        <AuthContext.Provider value={{fetchWrapper,getProfile,login,logout,loggedIn}}>
            {children}
        </AuthContext.Provider>
    )
}