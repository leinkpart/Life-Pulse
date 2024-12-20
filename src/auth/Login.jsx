import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../supabaseClient';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Hiển thị mật khẩu
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Email and password are required.');
            return;
        }
    
        setLoading(true);
    
        try {
            // Đăng nhập với email và password
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
    
            if (error) {
                Alert.alert('Login Failed', error.message);
                setLoading(false);
                return;
            }
    
            // Nếu đăng nhập thành công
            if (data.session) {
                // Chỉ lưu phiên đăng nhập nếu Remember Me được bật
                if (rememberMe) {
                    await AsyncStorage.setItem('supabaseSession', JSON.stringify(data.session));
                }
                Alert.alert('Success', 'Logged in successfully!');
                navigation.navigate('HomeStack');
            }
        } catch (err) {
            console.error('Login error:', err);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };    
    

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>VanzLynk</Text>
                </View>

                <Text style={styles.title}>Log in</Text>

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
                    <View style={styles.passwordHeader}>
                        <Text style={styles.label}>Password</Text>
                        <TouchableOpacity>
                            <Text style={styles.forgotPassword}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>
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

                {/* Remember me checkbox */}
                <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                        {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#0A1629" />
                    ) : (
                        <Text style={styles.loginButtonText}>Log in</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.signUpContainer} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.divider} />
                </View>

                {/* Nút Đăng nhập bằng Google */}
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="google" size={20} color="#fff" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Log in with Google</Text>
                </TouchableOpacity>

                {/* Nút Đăng nhập bằng Facebook */}
                <TouchableOpacity style={styles.socialButton}>
                    <Icon name="facebook" size={20} color="#fff" style={styles.socialIcon} />
                    <Text style={styles.socialButtonText}>Log in with Facebook</Text>
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
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 8,
        fontSize: 16,
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    forgotPassword: {
        color: '#fff',
        fontSize: 14,
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
        fontSize: 16,
    },

    loginButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#0A1629',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    signUpText: {
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

export default Login;
