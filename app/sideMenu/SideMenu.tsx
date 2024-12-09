import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HorizontalMenu: React.FC = () => {

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const [slideAnimation] = useState(new Animated.Value(0));

    const menuItems = [
        { id: 1, icon: 'archive-outline', text: 'Importar Excel', styles: styles.iconContainerImport},
        { id: 2, icon: 'checkmark-circle-outline', text: 'Finalizar', styles: styles.iconContainerFinally},
        { id: 3, icon: 'refresh-outline', text: 'Resetear Tabla', styles:styles.iconContainerReset}
    ];

    // Función para togglear el menú
    const toggleMenu = () => {
        // Cambiar estado de visibilidad
        const newVisibility = !isMenuVisible;
        setIsMenuVisible(newVisibility);

        // Animar entrada/salida del menú
        Animated.timing(slideAnimation, {
            toValue: newVisibility ? 1 : 0,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    return (
        <>
            {/* Botón para mostrar/ocultar menú */}
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={toggleMenu}
            >
                <Ionicons
                    name={isMenuVisible ? "close" : "menu"}
                    size={24}
                    color="white"
                />
            </TouchableOpacity>

            {/* Menú animado */}
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [
                            {
                                translateY: slideAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [100, 0] // Sube desde abajo
                                })
                            }
                        ],
                        opacity: slideAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1]
                        })
                    }
                ]}
            >
                <View style={styles.menuContainer}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => Alert.alert("Info", item.text + " clicked")}
                        >
                            <View style={item.styles}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={24}
                                    color="#333"
                                />
                            </View>
                            <Text style={styles.menuText}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    // Botón de toggle en la esquina
    toggleButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 100,
        backgroundColor: '#007bff',
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#f8f8f8',
        paddingVertical: 10,
        paddingBottom: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    menuItem: {
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#e0e0e0',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    menuText: {
        fontSize: 12,
        color: '#333',
    },
    iconContainerReset: {
        backgroundColor: '#ff4d4d',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    iconContainerFinally: {
        backgroundColor: 'green',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    iconContainerImport: {
        backgroundColor: '#0E7AFE',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    }
});

export default HorizontalMenu;