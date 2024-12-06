import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  BackHandler,
  Image,
  Alert,
} from "react-native";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import MeasurementDB from "./db/Db";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  const [dbInitialized, setDbInitialized] = useState(false); // Estado para verificar si DB está inicializada

  const setupDataBase = async () => {
    if (dbInitialized) return;
  
    try {
      // Check if database is already set up
      const existingData = await MeasurementDB.getAll();
      if (existingData.length > 0) {
        setDbInitialized(true);
        return;
      }
  
      console.log("Initializing database...");
      await MeasurementDB.initDB();
      setDbInitialized(true);
    } catch (error) {
      console.error("Error initializing the database:", error);
    }
  };

  useEffect(() => {
    try {
      if (!dbInitialized) {
        setupDataBase();
      }else{
        console.log("Tabla ya creada.")
      }
      const handleBackPress = () => true; // Bloquea el botón "atrás"
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    } catch (error) {
      console.error(error);
    }
  }, [dbInitialized]);

  const handleReset = () => {
    Alert.alert("Resetear", "¿Estas seguro de reiniciar la Tabla?", [
      {
        text: 'Resetear',
        onPress: async () => {
          await MeasurementDB.resetTable();
          // router.push("/loaderScreen");
        },
        style: "destructive",
      },
      {
        text: 'Cancelar',
        onPress: () => "",
        style: 'cancel',
      }
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <View style={styles.navbar}>
        <Text style={styles.title}>Mi Aplicación</Text>
        <Pressable onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.buttonText}>Reiniciar Tabla</Text>
        </Pressable>
      </View>
      <Image
        source={require("../assets/images/logoFirmat.png")} // Ruta de la imagen local
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Escaner de QR's</Text>
        <View style={styles.buttonsContainer}>
          <Pressable onPress={requestPermission} style={styles.button}>
            <Text style={styles.buttonText}>Solicitar Permisos</Text>
          </Pressable>
          <Link href={"/scanner"} asChild>
            <Pressable
              disabled={!isPermissionGranted}
              style={
                !isPermissionGranted ? styles.buttonBlocked : styles.button
              }
            >
              <Text style={styles.buttonText}>Escanear QR</Text>
            </Pressable>
          </Link>
          <Link href={"/manualInput"} asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Ingreso Manual</Text>
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
    justifyContent: "flex-start",
    padding: 20,
  },
  image: {
    width: 220, // Ancho de la imagen
    height: 120, // Alto de la imagen
    resizeMode: "contain", // Ajuste de la imagen
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
    width: "100%",
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
    opacity: 0.5,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0E7AFE',
    elevation: 4, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width:"100%",
    marginTop: 0,
    marginBottom:150
  },
  resetButton: {
    backgroundColor: '#ff4d4d', // Color rojo para indicar peligro
    padding: 10,
    borderRadius: 5,
  },
});
