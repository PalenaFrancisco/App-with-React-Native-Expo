import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet, Text, Pressable, SafeAreaView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,  // bordes redondeados
  50   // bordes redondeados
);

const Overlay = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.replace("/")}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backText}>Cancelar</Text>
      </Pressable>
      <Canvas
        style={styles.canvas}
      >
        <DiffRect inner={inner} outer={outer} color="gray" opacity={0.6} />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "#ff531a",
    padding:10,
    borderRadius:10,
    elevation: 4
  },
  backText: {
    color: "white",
    fontSize: 18,
    marginLeft: 5,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  }
});


export default Overlay;
