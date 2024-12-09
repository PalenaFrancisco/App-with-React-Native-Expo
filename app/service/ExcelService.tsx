// import React, { useState } from 'react';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import * as DocumentPicker from 'expo-document-picker';
// import * as XLSX from 'xlsx';
// import { View, Button, Alert } from 'react-native';

// // Interfaz para definir la estructura de los datos
// interface ExcelData {
//     [key: string]: any;
// }

// const ExcelService: React.FC = () => {
//     // Estado para almacenar los datos procesados
//     const [processedData, setProcessedData] = useState<ExcelData[] | null>(null);

//     const importExcel = async (): Promise<ExcelData[] | undefined> => {
//         try {
//             // Seleccionar archivo Excel
//             const result = await DocumentPicker.getDocumentAsync({
//                 type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//             });

//             if (result.assets && result.assets.length > 0) {
//                 const fileUri = result.assets[0].uri;

//                 // Leer contenido del archivo
//                 const fileContent = await FileSystem.readAsStringAsync(fileUri, {
//                     encoding: FileSystem.EncodingType.Base64
//                 });

//                 // Convertir archivo a workbook
//                 const workbook = XLSX.read(fileContent, { type: 'base64' });

//                 // Obtener la primera hoja
//                 const sheetName = workbook.SheetNames[0];
//                 const worksheet = workbook.Sheets[sheetName];

//                 // Convertir hoja a JSON
//                 const data: ExcelData[] = XLSX.utils.sheet_to_json(worksheet);

//                 // Procesar datos (ejemplo de transformación)
//                 const processedData = data.map(item => ({
//                     ...item,
//                     // Ejemplo: añadir una transformación
//                     nuevoCalculo: (item.valor || 0) * 2
//                 }));

//                 // Actualizar estado
//                 setProcessedData(processedData);

//                 return processedData;
//             }
//         } catch (error) {
//             // Manejo de errores
//             console.error('Error al importar Excel:', error);
//             Alert.alert('Error', 'No se pudo importar el archivo');
//         }
//     };

//     const exportExcel = async (data?: ExcelData[]): Promise<void> => {
//         try {
//             // Usar datos del estado si no se proporcionan
//             const dataToExport = data || processedData;

//             if (!dataToExport || dataToExport.length === 0) {
//                 Alert.alert('Error', 'No hay datos para exportar');
//                 return;
//             }

//             // Crear hoja de cálculo
//             const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

//             // Convertir a buffer de Excel
//             const excelBuffer = XLSX.write(workbook, {
//                 type: 'base64',
//                 bookType: 'xlsx'
//             });

//             // Generar nombre de archivo único
//             const fileName = `export_${Date.now()}.xlsx`;
//             const uri = `${FileSystem.documentDirectory}${fileName}`;

//             // Escribir archivo
//             await FileSystem.writeAsStringAsync(uri, excelBuffer, {
//                 encoding: FileSystem.EncodingType.Base64
//             });

//             // Compartir archivo
//             await Sharing.shareAsync(uri);

//             Alert.alert('Éxito', 'Archivo exportado correctamente');
//         } catch (error) {
//             console.error('Error al exportar Excel:', error);
//             Alert.alert('Error', 'No se pudo exportar el archivo');
//         }
//     };

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
//             <Button
//                 title="Importar Excel"
//                 onPress={importExcel}
//             />
//             <View style={{ marginTop: 10 }}>
//                 <Button
//                     title="Exportar Excel"
//                     onPress={() => exportExcel()}
//                     disabled={!processedData}
//                 />
//             </View>
//         </View>
//     );
// };

// export default ExcelService;