import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../supabaseClient';
import { Picker } from '@react-native-picker/picker';

const EditInfor = ({navigation}) => {
    const isValidPhoneNumber = (phone) => {
        const regex = /^(0[2-9][0-9]{8})$/; 
        return regex.test(phone);
    };    

    const [userData, setUserData] = useState({
        display_name: '',
        date_of_birth: '',
        gender: '',
        email: '',
        phone: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const formatDateToDisplay = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };
    
    const formatDateToISO = (date) => {
        if (!date) return '';
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('No user found');

                const { data, error } = await supabase
                    .from('users')
                    .select('display_name, date_of_birth, gender, email, phone')
                    .eq('user_id', user.id)
                    .single();

                if (error) throw error;

                setUserData({
                    display_name: data.display_name || '',
                    date_of_birth: formatDateToDisplay(data.date_of_birth) || '',
                    gender: data.gender || '',
                    email: data.email || '',
                    phone: data.phone || '',
                });
            } catch (error) {
                console.error('Error fetching user data:', error.message);
                Alert.alert('Error', 'Failed to load user data. Please try again.');
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Update auth email if it has changed
            if (user.email !== userData.email) {
                const { error: updateAuthError } = await supabase.auth.updateUser({ email: userData.email });
                if (updateAuthError) throw updateAuthError;
            }

            // Kiểm tra số điện thoại
            if (!isValidPhoneNumber(userData.phone)) {
                Alert.alert('Warning', 'Invalid phone number.');
                setIsSaving(false);
                return;
            }

            // Chuyển đổi ngày về dạng ISO trước khi lưu
            const formattedDateOfBirth = formatDateToISO(userData.date_of_birth);

            // Update user profile in the users table
            const { error: updateProfileError } = await supabase
                .from('users')
                .update({
                    display_name: userData.display_name,
                    date_of_birth: formattedDateOfBirth,
                    gender: userData.gender,
                    email: userData.email,
                    phone: userData.phone,
                })
                .eq('user_id', user.id);

            if (updateProfileError) throw updateProfileError;

            Alert.alert('Success', 'Your information has been updated successfully!',[
                {
                    text: 'OK',
                    onPress: () => {
                        // Xóa text trong các ô input
                        setUserData({
                            display_name: '',
                            date_of_birth: '',
                            gender: '',
                            email: '',
                            phone: '',
                        });
                        // Quay về trang trước
                        navigation.goBack();
                    }
                }
            ]);
        } catch (error) {
            console.error('Error updating user data:', error.message);
            Alert.alert('Error', 'An error occurred while saving your information. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{paddingBottom: 20}}>
            <View style={styles.container2}>
                <Text style={styles.headerText}>Edit Personal Information</Text>

                <View style={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.title}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={userData.display_name}
                            onChangeText={(text) => setUserData({ ...userData, display_name: text })}
                            placeholder="Enter your full name"
                            placeholderTextColor="#aaa"
                        />
                    </View>                  

                    <View style={styles.separator} />

                    <View style={styles.inputGroup}>
                        <Text style={styles.title}>Date of Birth</Text>
                        <TextInput
                            style={styles.input}
                            value={userData.date_of_birth}
                            onChangeText={(text) => setUserData({ ...userData, date_of_birth: text })}
                            placeholder="DD-MM-YYYY"
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.inputGroup}>
                        <Text style={styles.title}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={userData.phone}
                            onChangeText={(text) => setUserData({ ...userData, phone: text })}
                            placeholder="Phone number"
                            placeholderTextColor="#aaa"
                            keyboardType="numeric" // Chỉ cho phép nhập số
                        />
                    </View>
                    
                    <View style={styles.separator} />

                    <View style={styles.inputGroup}>
                        <Text style={styles.title}>Gender</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={userData.gender}
                                onValueChange={(itemValue) => setUserData({ ...userData, gender: itemValue })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.inputGroup}>
                        <Text style={styles.title}>Email</Text>
                        <Text style={styles.value}>{userData.email}</Text>
                    </View>

                </View>

                <TouchableOpacity
                    style={[styles.saveButton, isSaving && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Information'}</Text>
                </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#040D12',
        // padding: 20,
    },
    container2: {
        flex: 1,
        padding: 20
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    content: {
        padding: 15,
        backgroundColor: '#2C2C2E',
        borderRadius: 10,
    },
    inputGroup: {
        marginBottom: 5,
    },
    title: {
        fontSize: 18,
        color: '#f1f1f1',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: "#808080",
        marginTop: 4
    },
    input: {
        fontSize: 16,
        color: '#f1f1f1',
        backgroundColor: '#1E1E1E',
        padding: 10,
        borderRadius: 8,
    },
    pickerContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        overflow: 'hidden',
        height: 100,
        justifyContent: 'center'
    },
    picker: {
        color: '#fff',
        backgroundColor: 'transparent',
    },
    separator: {
        height: 1,
        backgroundColor: '#006666',
        marginVertical: 5,
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: '#006666',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#555',
    },
    saveButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EditInfor