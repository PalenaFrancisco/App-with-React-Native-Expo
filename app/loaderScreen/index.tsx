import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

const LoaderScreen = () => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false); // Estado para controlar la navegación

  useEffect(() => {
    // Iniciar la animación de la barra de progreso
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000, // Duración de la animación en milisegundos
      useNativeDriver: false,
    }).start();

    // Navegar a la pantalla principal después de 3 segundos solo si no se ha navegado antes
    const timer = setTimeout(() => {
      if (!hasNavigated) {
        router.push("/"); // Cambia "Home" por el nombre de tu pantalla principal
        // setHasNavigated(true); // Marca que ya se ha navegado
      }
    }, 3000);
    clearTimeout(timer);
    setHasNavigated(true)
    // Limpiar el temporizador al desmontar el componente
    // return () => clearTimeout(timer);
  }, [router, progress, hasNavigated]);

  // Calcular el ancho de la barra de progreso
  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cargando...</Text>
      <View style={styles.loaderContainer}>
        <Animated.View style={[styles.loader, { width }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loaderContainer: {
    width: "80%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  loader: {
    height: "100%",
    backgroundColor: "#0E7AFE",
  },
});

export default LoaderScreen;
