import { View, Text, StyleSheet, SafeAreaView, Pressable, BackHandler, TextInput, ActivityIndicator, Alert, Keyboard } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import MeasurementDB from "../db/Db";

export default function Home() {
    const params = useLocalSearchParams();
    const { info } = params;
    const router = useRouter();
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Estado para la rueda de carga
    const data = JSON.parse(info as string);

    useEffect(() => {

        const handleBackPress = () => true; // Bloquea el botón "atrás"
        BackHandler.addEventListener("hardwareBackPress", handleBackPress);

        return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, []);

    const showText = () => {
        if (text === "" || Number.parseInt(text) < data.valAnt) {
            Alert.alert("Error", "Ingrese un nuevo valor que sea mayor o igual a " + data.valAnt);
        } else {
            try{
                Keyboard.dismiss();
                setIsLoading(true);
                const newMeasurement = Number.parseInt(text);
                MeasurementDB.updateMeasurement(data.code, newMeasurement);
                
                setTimeout(() => {
                    setIsLoading(false);
                    router.replace({ pathname: "/details/detailsScreen", params: { info, text } });
                }, 3000);
            }catch(error){
                console.error(error);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: "Details", headerShown: false }} />
            <Pressable style={styles.backButton} onPress={() => router.replace("/")}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.backText}>Cancelar</Text>
            </Pressable>
            <Text style={styles.title}>Details</Text>
            <Text style={{ color: "black" }}>Codigo del medidor: {data.code}</Text>
            <Text style={{ color: "black" }}>Direccion: {data.direction}</Text>
            <Text style={{ color: "black" }}>Medicion anterior: {data.valAnt}</Text>
            <Text style={styles.label}>Ingresa nueva medicion:</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingrese el nuevo valor"
                placeholderTextColor="#aaa"
                value={text}
                keyboardType="numeric"
                onChangeText={(value) => setText(value)}
            />
            <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={showText} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" /> // Muestra la rueda de carga en el botón
                ) : (
                    <Text style={styles.buttonText}>Enviar</Text>
                )}
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
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
    title: {
        color: "black",
        fontSize: 24,
        marginBottom: 10,
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
    buttonDisabled: {
        backgroundColor: "#555", // Cambia el color para mostrar que está deshabilitado
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});
