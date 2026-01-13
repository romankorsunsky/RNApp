import { Link } from "expo-router"
import { Text, TouchableOpacity } from "react-native"
import '../global.css'


export default function NavButton({href,label,active}: any){
    return(
        <Link href={href} asChild>
        <TouchableOpacity 
            className="h-12 my-2 rounded-3xl items-center justify-center"
            style={{
                backgroundColor:active ? 'white': 'black',
            }}>
            <Text style={
                {
                    color:active ? 'black': 'white',
                    fontSize: 20,
                    paddingHorizontal:4,
                    }}
                >{label}</Text>
        </TouchableOpacity>
    </Link>
)
}