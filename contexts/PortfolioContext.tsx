import { Portfolio, PortfolioState, PositionEntry } from "@/Types/Types";
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { API_BASE_URL, AuthContext } from "./AuthContext";



export const PortfolioContext = createContext<PortfolioState>(
    {
        portfolios : [],
        clearPortfolios : () => {throw new Error("Didn't init PorfolioContext");},
        getPortfolioByDisplayName : (name:string) => {throw new Error("Didn't init PorfolioContext");},
        addPortfolio: (ptf: Portfolio) => {throw new Error("Didn't init PorfolioContext");},
        fetchPortfolios: (sig: AbortSignal | null) => {throw new Error("stahp it");},
        removePosition: (str:string) => {throw new Error("Didn't init PorfolioContext")}
    }
);


export function PortfolioContextProvider({children}:PropsWithChildren){
    const [portfolios,setPortfolios] = useState<Portfolio[]>([]);
    const {fetchWrapper,loggedIn} = useContext(AuthContext);

    useEffect(()=>{
        const res = portfolios.map(p => p);
        setPortfolios(res);
    },[]);

    useEffect(() => {
        if(loggedIn){
            fetchPortfolios();
        }
        else{
            clearPortfolios();
        }
    },[loggedIn])

    const clearPortfolios = () => {
        setPortfolios([]);
        return;
    }
    const getPortfolioByDisplayName = (displayName:string) => {
        for (let i = 0; i < portfolios.length; i++) {
            if(portfolios[i].displayName === displayName){
                return portfolios[i];
            }
        }
        return null;
    }
    const fetchPortfolios = async function(abortSignal:AbortSignal | null = null){
        
        const uri = API_BASE_URL + "portfolios"
        const request:Request = new Request(uri,{
            method: "GET",
            signal: abortSignal
        });
        try{
            const response = await fetchWrapper(request);
            if(response.status === 200){
                const portfolios: Portfolio[] = await response.json();
                setPortfolios(portfolios);
            }
        }
        catch({message}:any){
            console.log(`[Error]: In fetchPortfolios:` + message);
        }
    }
    const addPortfolio = (ptf:Portfolio) => {
        setPortfolios(old => old.concat([ptf]));
    }
    const removePosition = (ptfId:string,posId:string) => {
        const ptf:Portfolio | undefined = portfolios.find(ptf => ptf.id === ptfId);
        if(!ptf) return;
        const newPostions:PositionEntry[] = ptf.positions.filter(pos => pos.id !== posId);
        setPortfolios(portfolios.map(ptf => {
            if(ptf.id !== ptfId)
                return ptf;
            const newPtf:Portfolio ={id:ptf.id,displayName:ptf.displayName,portfolioType:ptf.portfolioType,
                positions:newPostions
            };
            console.log("JSON.stringify(newPtf)");
            return newPtf;
        }));
    }
    return <PortfolioContext.Provider value={{fetchPortfolios,clearPortfolios,removePosition,
        getPortfolioByDisplayName,addPortfolio,portfolios}}>
        {children}
    </PortfolioContext.Provider>
}