import { View, Text, StyleSheet, SafeAreaView, Pressable, BackHandler, Image } from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { useEffect } from "react";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    const handleBackPress = () => true; // Bloquea el botón "atrás"
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
  
    return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <Image
        source={require('../assets/images/logoFirmat.png')} // Ruta de la imagen local
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Escaner de QR's</Text>
        <View style={styles.buttonsContainer}>
          <Pressable onPress={requestPermission} style={styles.button}>
            <Text style={styles.buttonText}>Solicitar Permisos</Text>
          </Pressable>
          <Link href={"/scanner"} asChild>
            <Pressable disabled={!isPermissionGranted} style={!isPermissionGranted ? styles.buttonBlocked : styles.button}>
              <Text style={styles.buttonText}>Escanear QR</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white", // Fondo oscuro
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 220, // Ancho de la imagen
    height: 120, // Alto de la imagen
    resizeMode: 'contain', // Ajuste de la imagen
    marginBottom: 30,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "black", // Blanco para el título
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    gap: 20,
    width: '100%',
  },
  button: {
    backgroundColor: "#0E7AFE", // Color azul de los botones
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // Sombra sutil
  },
  buttonText: {
    color: "#fff", // Texto blanco
    fontSize: 18,
    fontWeight: "600",
  },
  buttonBlocked: {
    backgroundColor: "#0E7AFE", // Color azul de los botones
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // Sombra sutil
    opacity:0.5
  }
});
