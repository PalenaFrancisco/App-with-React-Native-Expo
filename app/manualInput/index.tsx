import { useRouter, Stack} from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Keyboard, Pressable, StatusBar, StyleSheet, Text, TextInput } from "react-native";
import MeasurementDB from "../db/Db";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Home(){
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");


    useEffect(() =>{
        const handleBackPress = () =>true;

        BackHandler.addEventListener("hardwareBackPress", handleBackPress);

        return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, []);


    const showText = async() =>{
        if(text == ""){
            Alert.alert("Error", "Ingrese un valor");
            Keyboard.dismiss();
        }else{
            try{
                Keyboard.dismiss();
                setIsLoading(true);
                const code = Number.parseInt(text);
                const data =  await MeasurementDB.getInfoCode(code);

                if(data){
                    router.replace({pathname:"/details", params:{info: JSON.stringify(data)}})
                }else{
                    Alert.alert("Codigo no encontrado", "Desea volver?",[{
                        text: 'Volver',
                        onPress: () => router.replace("/"),
                        style: 'cancel',
                    },{
                        text: 'Intentar de Nuevo',
                        onPress: () => setIsLoading(false),
                        style: 'default',
                    }])
                }
            }catch(error){
                console.error(error);
            }
        }
    }


    return(
        <SafeAreaView style={styles.container}>
            <Stack.Screen
            options={{title: "manualInput",headerShown:false}}/>
            <Pressable style={styles.backButton} onPress={() => router.replace("/")}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.backText}>Cancelar</Text>
            </Pressable>
            <Text style={styles.label}>Ingrese el codigo:</Text>
            <TextInput 
                style={styles.input}
                placeholder="Codigo"
                placeholderTextColor="#aaa"
                value={text}
                keyboardType="numeric"
                onChangeText={(value) => setText(value)}
            />
            <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={showText} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" /> // Muestra la rueda de carga en el botón
                ) : (
                    <Text style={styles.buttonText}>Buscar</Text>
                )}
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ff531a",
        padding:10,
        borderRadius:10,
        elevation: 6
    },
    backText: {
        color: "white",
        fontSize: 18,
        marginLeft: 5,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: "black",
    },
    input: {
        width: "50%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
        fontSize: 16,
        marginBottom: 8,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: 120,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    buttonDisabled: {
        backgroundColor: "#555", // Cambia el color para mostrar que está deshabilitado
    }
})