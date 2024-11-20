import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { supabase } from '../supabaseClient';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';

const CustomDrawer = (props) => {
    const [userData, setUserData] = useState({ avatar_url: '', display_name: '', email: '' });
    const navigation = useNavigation();

    // Fetch user data from Supabase
    const fetchUserData = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('No user found');
            }

            const { data, error } = await supabase
                .from('users')
                .select('avatar_url, display_name, email')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            setUserData(data); // Update user data state
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            // You can show an alert here to inform the user about the error
        }
    }, []);

    useEffect(() => {
        fetchUserData();

        // Listen for authentication state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(() => {
            fetchUserData(); // Re-fetch user data when authentication state changes
        });

        // Cleanup listener when the component is unmounted
        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, [fetchUserData]);

    // Handle logout functionality
    const handleLogout = async () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đăng xuất",
                    onPress: async () => {
                        try {
                            // Log out from Supabase
                            console.log('Bắt đầu đăng xuất');
                            const { error } = await supabase.auth.signOut();
                            if (error) throw error;

                            // Remove session from AsyncStorage
                            console.log('Đăng xuất khỏi Supabase');
                            await AsyncStorage.removeItem('userSession');

                            // Navigate to the Login screen
                            console.log('Chuyển hướng đến màn hình Login');
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                })
                            );

                            console.log('Đăng xuất hoàn tất');
                        } catch (error) {
                            console.error('Lỗi khi đăng xuất:', error);
                            Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={{ uri: userData.avatar_url ? `${userData.avatar_url}?t=${new Date().getTime()}` : 'https://via.placeholder.com/100' }}
                    style={styles.avatar}
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.name}>{userData.display_name}</Text>
                    <Text style={styles.email}>{userData.email}</Text>
                </View>
            </View>

            {/* Drawer Content */}
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 10 }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            {/* Footer - Logout button */}
            <TouchableOpacity style={styles.footer} onPress={handleLogout}>
                <View style={[styles.iconContainer, styles.squareBackground]}>
                    <FontAwesome name="sign-out" color="#E53935" size={34} />
                </View>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingLeft: 20,
        backgroundColor: '#1F1F1F',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        paddingTop: 30,
        paddingBottom: 10
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 50,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    email: {
        color: '#AAAAAA',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: "#1F1F1F",
        borderRadius: 20,
        bottom: 15
    },
    logoutText: {
        color: '#E53935',
        fontSize: 20,
        marginLeft: 20,
    },
    iconContainer: {
        backgroundColor: '#E53935',
        padding: 10,
        borderRadius: 10,
    },
    squareBackground: {
        backgroundColor: '#1F1F1F',
    },
});

export default CustomDrawer;
