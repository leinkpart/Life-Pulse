import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as Location from 'expo-location'; // Sử dụng expo-location
import haversine from 'haversine';

const Cycling = () => {
    const [distance, setDistance] = useState(0);
    const [lastPosition, setLastPosition] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [locationSubscription, setLocationSubscription] = useState(null);

    useEffect(() => {
        const checkPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync(); // Sử dụng hàm của expo-location
            if (status === 'granted') {
                console.log('Permission granted');
            } else {
                Alert.alert("Không có quyền truy cập vị trí", "Vui lòng cấp quyền trong cài đặt ứng dụng.");
            }
        };

        checkPermission();
    }, []);

    useEffect(() => {
        let subscription;

        const startLocationTracking = async () => {
            try {
                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 1, // Khoảng cách tính bằng mét
                        timeInterval: 3000,  // Tính bằng milliseconds
                    },
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        const currentPosition = { latitude, longitude };

                        if (lastPosition) {
                            const distanceTravelled = haversine(lastPosition, currentPosition, { unit: 'km' });
                            setDistance((prevDistance) => prevDistance + distanceTravelled);
                        }

                        setLastPosition(currentPosition);
                    }
                );
                setLocationSubscription(subscription); // Lưu subscription vào state
            } catch (error) {
                console.log("Error starting location tracking:", error);
            }
        };

        if (isTracking) {
            startLocationTracking();
        } else if (locationSubscription) {
            locationSubscription.remove(); // Đảm bảo dừng theo dõi vị trí khi dừng
            setLocationSubscription(null); // Đặt lại subscription về null
        }

        return () => {
            // Cleanup subscription khi component unmount hoặc khi isTracking thay đổi
            if (subscription) {
                subscription.remove();
                setLocationSubscription(null);
            }
        };
    }, [isTracking, lastPosition]); // Chạy lại khi thay đổi isTracking hoặc lastPosition

    const startTracking = () => {
        setIsTracking(true);
        setDistance(0);
        setLastPosition(null);
    };

    const stopTracking = () => {
        setIsTracking(false);
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/cycling1.png')}
                style={styles.image}
            />
            <Text style={styles.title}>Theo Dõi Khoảng Cách Đạp Xe</Text>
            <Text style={styles.distance}>Bạn đã đạp xe được: {distance.toFixed(3)} km</Text>
            <TouchableOpacity 
                style={[styles.button, isTracking && styles.buttonActive]} 
                onPress={isTracking ? stopTracking : startTracking}
            >
                <Text style={styles.buttonText}>{isTracking ? "Stop" : "Start"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    distance: {
        fontSize: 18,
        marginBottom: 20,
    },
    image: {
        width: '60%',
        height: '35%',
        marginBottom: 20,
        borderRadius: 20,
        marginTop: 10,
        padding: 5,
    },
    button: {
        width: '80%',  
        paddingVertical: 12,  // Khoảng cách bên trong button
        borderRadius: 25, 
        backgroundColor: '#4CAF50',
        marginBottom: 20, 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute',
        bottom: 20,
    },
    buttonActive: {
        backgroundColor: '#FF6347',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18, 
        fontWeight: 'bold',
    },
});

export default Cycling;
