import { Text, TouchableOpacity } from 'react-native';
import '../global.css';

//this component is absolutely garbage, it was the first react component
//so forgive me
export default function ThemedButton({text,textSize,onPress,bgStyle,textColor}: any){
    const textStyle = "text-" + textSize + " text-center text-" + textColor + " w-full";
    return(
        <TouchableOpacity className={bgStyle} onPress={onPress}>
            <Text className={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
}