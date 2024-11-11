import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { supabase } from '../../supabaseClient';

const Register = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [receiveUpdates, setReceiveUpdates] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Hiển thị mật khẩu
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Hiển thị mật khẩu xác nhận

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSignUp = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name'); 
            return;
        }
    
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
    
        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long'); 
            return; 
        }
    
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
    
        try {
            // Tạo tài khoản người dùng với Supabase Auth
            const { data: { user }, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                Alert.alert('Error', error.message);
                return;
            }

            if (user) {
                // Nếu đăng ký thành công, lưu thông tin người dùng vào database (supabase)
                const { data, error: insertError } = await supabase
                    .from('users')
                    .insert([
                    {
                        user_id: user.id, // Sử dụng ID từ Supabase Auth
                        display_name: fullName,
                        email: email, 
                        password: password,
                        avatar_url: 'https://i.imgur.com/rKBHmsb.png',
                        receive_update: receiveUpdates,
                        created_at: new Date().toISOString(),
                    }
                ]);

                if (insertError) {
                    console.error('Error inserting user data:', insertError);
                    Alert.alert('Error', 'Failed to save user information');
                    return;
                }
          
                Alert.alert('Success', 'Registration successful!');
                navigation.navigate('Login');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
        

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>VanzLynk</Text>
                </View>

                <Text style={styles.title}>Sign up</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Your full name"

                        placeholderTextColor="#666"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="your@email.com"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#666"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Icon
                                name={showPassword ? "eye" : "eye-slash"}
                                size={24}
                                color="white"
                                style={styles.iconEye}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#666"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Icon
                                name={showConfirmPassword ? "eye" : "eye-slash"}
                                size={24}
                                color="white"
                                style={styles.iconEye}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setReceiveUpdates(!receiveUpdates)}
                >
                    <View style={[styles.checkbox, receiveUpdates && styles.checkboxChecked]}>
                        {receiveUpdates && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>I want to receive updates via email.</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                    <Text style={styles.signUpButtonText}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signInContainer} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signInText}>Already have an account? Sign in</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.divider} />
                </View>

                {/* Nút Sign up with Google */}
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="google" size={20} color="#fff" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Sign up with Google</Text>
                </TouchableOpacity>

                {/* Nút Sign up with Facebook */}
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="facebook" size={20} color="#fff" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Sign up with Facebook</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1629',
    },
    scrollView: {
        flexGrow: 1,
        padding: 20,
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        color: '#3B82F6',
        fontSize: 20,
        fontWeight: 'bold',
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        textAlign: 'center'
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        backgroundColor: '#1A2737',
        borderRadius: 8,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A2737',
        borderRadius: 8,
        paddingRightHorizontal: 25,
    },

    iconEye: {
        marginRight: 20
    },

    errorText: {
        color: '#FF4136',
        fontSize: 14,
        marginTop: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#fff',
    },
    checkmark: {
        color: '#0A1629',
        fontSize: 14,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        color: '#fff',
        fontSize: 14,
    },
    signUpButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    signUpButtonText: {
        color: '#0A1629',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signInContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    signInText: {
        color: '#fff',
        fontSize: 14,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    dividerText: {
        color: '#fff',
        paddingHorizontal: 10,
    },
    socialButton: {
        flexDirection: 'row',
        backgroundColor: '#1A2737',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'center'
    },
    socialButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10
    },
});

export default Register;