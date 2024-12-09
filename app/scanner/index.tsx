import { CameraView } from "expo-camera";
import { Stack, useRouter} from "expo-router";
import {
  Alert,
  AppState,
  Dimensions,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import Overlay from "./Overlay";
import { useEffect, useRef } from "react";
import MeasurementDB from "../db/Db";


export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  // const navigation = useNavigation();
  const router = useRouter();
  // const params = useLocalSearchParams(); 

  const searchCode = async(code: number) =>{
    try{
      const data = await MeasurementDB.getInfoCode(code);
      if(data){
        router.replace({pathname: "/details", params:{info: JSON.stringify(data)} })
      }else{
        Alert.alert("Codigo no encontrado", "Desea volver?",[{
          text: 'Volver',
          onPress: () => router.replace("/"),
          style: 'cancel',
        },{
          text: 'Intentar de Nuevo',
          onPress: () => "",
          style: 'default',
        }])
      }
    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      
      <CameraView
        style={styles.camera_container}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            const number = Number.parseInt(data);
            searchCode(number);

            setTimeout(() => {
              qrLock.current = false;
            }, 5000);
          }
        }}
      >
        {<Overlay />}
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  camera_container: {
    ...StyleSheet.absoluteFillObject,
  }
})
