import { View, Text, StyleSheet, SafeAreaView, Pressable, BackHandler, TextInput, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export default function Home() {

    const params = useLocalSearchParams();
    const { code, number } = params;
    const router = useRouter();

    useEffect(() => {
        const handleBackPress = () => true; // Bloquea el botón "atrás"
        BackHandler.addEventListener("hardwareBackPress", handleBackPress);

        return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: "Summary", headerShown: false }} />
            <Pressable style={styles.backButton} onPress={() => router.replace("/")}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.backText}>Volver</Text>
            </Pressable>
            <Text style={styles.title}>Resumen</Text>
            <Text style={styles.label}>Codigo del medidor: {code}</Text>
            <Text style={styles.label}>
                Nueva medicion: <Text style={styles.blackText}>{number}</Text>
                </Text>
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
        backgroundColor: "#333333",
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
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: "black",
    },
    blackText: {
        color: "black",
        fontWeight: "bold"
    }
});
