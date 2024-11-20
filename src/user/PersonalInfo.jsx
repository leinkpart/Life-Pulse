import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../../supabaseClient';

const PersonalInfo = ({navigation}) => {
    const [userData, setUserData] = useState({ display_name: '', date_of_birth: '', gender: '', email: '', phone: '' });

    useEffect(() => {
        // Lấy dữ liệu người dùng từ Supabase
        const fetchUserData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                // Truy vấn dữ liệu từ bảng 'users'
                const { data, error } = await supabase
                    .from('users')
                    .select('display_name, date_of_birth, gender, email, phone')   
                    .eq('user_id', user.id)
                    .single(); // Lấy một bản ghi duy nhất
    
                if (error) {
                    throw error;
                }
    
                // Cập nhật state với dữ liệu người dùng
                setUserData({
                    display_name: data.display_name,
                    date_of_birth: formatDate(data.date_of_birth),
                    gender: data.gender,
                    email: data.email,
                    phone: data.phone,
                });
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };
    
        fetchUserData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    

    return (
        <View style={styles.container}>
        <ScrollView >
            <View style={styles.header}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                    Thông tin cá nhân
                </Text>

                <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Edit Information')}>
                    <Feather name='edit' style={styles.icon} />
                </TouchableOpacity>               
            </View>

            <Text style={{ color: 'white', marginBottom: 20, fontSize: 15, color: '#c0c0c0' }}>
                Chúng tôi sử dụng thông tin này để xác minh danh tính của bạn và bảo vệ
                cộng đồng của chúng tôi. Bạn là người quyết định những thông tin cá
                nhân nào sẽ hiển thị với người khác.
            </Text>

            <View style={styles.Content}>
                <View style={styles.nameDisplay}>
                    <Text style={styles.title}>Họ tên</Text>
                    <Text style={styles.value}>{userData.display_name}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.nameDisplay}>
                    <Text style={styles.title}>Ngày sinh</Text>
                    <Text style={styles.value}>{userData.date_of_birth || 'Chưa cập nhật'}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.nameDisplay}>
                    <Text style={styles.title}>Giới tính</Text>
                    <Text style={styles.value}>{userData.gender || 'Chưa cập nhật'}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.nameDisplay}>
                    <Text style={styles.title}>Thông tin liên hệ</Text>
                    <Text style={styles.value}>{userData.email}</Text>
                    <Text style={styles.value}>{userData.phone || 'Chưa cập nhật'}</Text>
                </View>
            </View>
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#040D12',
        padding: 20,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5
    },

    headerIcon: {
        backgroundColor: "#444",
        padding: 10,
        borderRadius: 50
    },

    icon: {
        color: "#fff",
        fontSize: 20,
    },

    Content: {
        padding: 15,
        backgroundColor: "#2C2C2E",
        borderRadius: 10,
    },

    title: {
        fontSize: 20,
        color: "#f1f1f1",
        fontWeight: '500'
    },

    value: {
        fontSize: 16,
        color: "#808080",
        marginTop: 4
    },

    separator: {
        height: 1,
        backgroundColor: '#006666',
        marginBottom: 10,
        marginTop: 10
    },
    
})

export default PersonalInfo
