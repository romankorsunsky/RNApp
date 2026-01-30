import { Portfolio, PortfolioState } from "@/Types/Types";
import React, { createContext, PropsWithChildren, useEffect, useState } from "react";



export const PortfolioContext = createContext<PortfolioState>(
    {
        portfolios : [],
        clearPortfolios : () => {throw new Error("Didn't init PorfolioContext");},
        getPortfolioByDisplayName : (name:string) => {throw new Error("Didn't init PorfolioContext");},
        addPortfolio: (ptf: Portfolio) => {throw new Error("Didn't init PorfolioContext");}
    }
);


export function PortfolioContextProvider({children}:PropsWithChildren){
    const [portfolios,setPortfolios] = useState<Portfolio[]>([]);

    useEffect(()=>{

    },[]);

    const clearPortfolios = () => {
        setPortfolios([]);
        return;
    }
    const getPortfolioByDisplayName = (displayName:string) => {
        for (let i = 0; i < portfolios.length; i++) {
            if(portfolios[i].DisplayName === displayName){
                return portfolios[i];
            }
        }
        return null;
    }
    const addPortfolio = (ptf:Portfolio) => {

    }
    return <PortfolioContext.Provider value={{portfolios,clearPortfolios,getPortfolioByDisplayName,addPortfolio}}>
        {children}
    </PortfolioContext.Provider>
}