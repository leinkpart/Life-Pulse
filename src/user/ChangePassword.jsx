import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '../../supabaseClient';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const user = supabase.auth.getUser(); // Lấy thông tin người dùng đang đăng nhập

    // Kiểm tra mật khẩu mới có hợp lệ hay không
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các trường');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Lỗi', 'Mật khẩu không khớp');
            return;
        }

        if (!validatePassword(newPassword)) {
            Alert.alert('Lỗi', 'Mật khẩu không đúng định dạng. Cần tuân thủ định dạng mật khẩu.');
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
      
            if (!user) {
                Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
                return;
            }
      
            // Verify current password
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            });
      
            if (signInError) {
                Alert.alert('Lỗi', 'Mật khẩu hiện tại không chính xác');
                return;
            }
      
            // Update password
            const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      
            if (updateError) {
                Alert.alert('Lỗi', 'Không thể cập nhật mật khẩu: ' + updateError.message);
                return;
            }
      
            Alert.alert('Thành công', 'Mật khẩu đã được cập nhật');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            Alert.alert('Lỗi', 'Đã xảy ra lỗi: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView  contentContainerStyle={styles.scrollView}>
            <Text style={styles.title}>Đổi Mật Khẩu</Text>
            <Text style={styles.label}>Mật khẩu của bạn phải có ít nhất 8 ký tự, đồng thời bao gồm cả chữ số, chữ cái in hoa, chữ cái thường và ký tự đặc biệt (!@#$%&).</Text>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    placeholderTextColor="#666"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                />

                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <Icon
                        name={showCurrentPassword ? "eye" : "eye-slash"}
                        size={24}
                        color="white"
                        style={styles.iconEye}
                    />
                </TouchableOpacity>
            </View>
           
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#666"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                />

                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Icon
                        name={showNewPassword ? "eye" : "eye-slash"}
                        size={24}
                        color="white"
                        style={styles.iconEye}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#666"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry={!showConfirmNewPassword}
                />

                <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                    <Icon
                        name={showConfirmNewPassword ? "eye" : "eye-slash"}
                        size={24}
                        color="white"
                        style={styles.iconEye}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#040D12',
        padding: 22,
    },
    scrollView: {
        flexGrow: 1,
        // justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        // textAlign: 'center',
        color: '#fff'
    },
    label: {
        fontSize: 16,
        color: '#A6AEBF',
        marginBottom: 25,
    },
    input: {
        backgroundColor: '#1A2737',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 18,
        flex: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A2737',
        borderRadius: 10,
        paddingRightHorizontal: 25,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#555'
    },

    iconEye: {
        marginRight: 20
    },

    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 30
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '750'
    },
});

export default ChangePassword
