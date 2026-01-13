import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';


export default function Forex(){
    const [items,setItems] = useState([]);

    useEffect(() =>{
        
    },[]);

    return(
        <View className="bg-white mt-2 pt-2 w-full items-center justify-center flex-1">
            {items.map((item,index) => (
                <Text key={index}>{item}</Text>
            ))}
        </View>
    )
}