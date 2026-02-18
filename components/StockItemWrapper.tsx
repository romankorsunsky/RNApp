import { StockItemWrapperProp } from "@/Types/Types";
import { useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import StockItem from "./StockItem";


export default function StockItemWrapper({longName,symbol,price,setModalInfo}:StockItemWrapperProp){
    const prevPriceRef = useRef(Math.random() > 0.5 ? 0.0 : Number.MAX_VALUE);

    useEffect(() => {
        prevPriceRef.current = price;
    },[price])
    function onTouchButton(){
        setModalInfo(symbol);
    }
    return <TouchableOpacity onPress={() => onTouchButton()}>
            <StockItem 
                symbol={symbol}
                longName={longName}
                key={symbol}
                price={price}
                isUp={price > prevPriceRef.current}
            ></StockItem>
        </TouchableOpacity> 
            
}