import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../supabaseClient';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../../cloudinary';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Profile({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState({ avatar_url: '', display_name: '', email: '' });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // if (!user) throw new Error('No user found');
    
        const { data, error } = await supabase
            .from('users')
            .select('avatar_url, display_name, email')
            .eq('user_id', user.id)
            .single();
    
        if (error) throw error;
    
        setUserData(data);
        if (data.avatar_url) setProfileImage(data.avatar_url);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const handleRefresh = useCallback( async() => {
    setRefreshing(true);  // Bắt đầu quá trình làm mới
    try {
        const { data: { user } } = await supabase.auth.getUser();
        // Truy vấn dữ liệu từ bảng 'users'
        const { data, error } = await supabase
            .from('users')
            .select('display_name, avatar_url, email')
            .eq('user_id', user.id)
            .single(); // Lấy một bản ghi duy nhất

        if (error) {
            throw error;
        }

        // Cập nhật state với dữ liệu người dùng
        setUserData({
            avatar_url: data.avatar_url,
            display_name: data.display_name,
            email: data.email
        });
    } catch (error) {
        console.error('Error fetching user data:', error.message);
    } finally {
        setRefreshing(false);  // Kết thúc quá trình làm mới
    }
  }, []);

  const pickImage = async () => {   
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = await uploadImageToCloudinary(result.assets[0].uri);
      if (imageUrl) {
        await updateUserAvatarUrl(imageUrl);
        setProfileImage(imageUrl);
      }
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri, 
      type: 'image/jpeg', 
      name: 'profile.jpg'
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload to Cloudinary failed: ', error);
      return null;
    }
  };    

  const updateUserAvatarUrl = async (url) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('users')
        .update({ avatar_url: url })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setUserData(prevData => ({ ...prevData, avatar_url: url }));
    } catch (error) {
      console.error('Error updating avatar URL in Supabase: ', error);
    }
  };

  useEffect(() => {
    if (userData.avatar_url) {
      setProfileImage(userData.avatar_url);
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      // 1. Đăng xuất khỏi Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
  
      // 2. Xóa phiên đăng nhập khỏi AsyncStorage
      await AsyncStorage.removeItem('supabaseSession');
  
      // 3. Chuyển hướng về màn hình Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
  
      Alert.alert('Success', 'Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Could not log out. Please try again.');
    }
  };
  

  const renderImageOptionsModal = useCallback(() => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
            <Text style={styles.modalOptionText}>Chọn ảnh đại diện</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalOptionText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ), [isModalVisible, pickImage]);

  const renderSettingItem = (title, subtitle = '', onPress) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <Text style={styles.settingText}>{title}</Text>
      <View style={styles.settingRight}>
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}
        refreshControl={
          <RefreshControl 
              refreshing={refreshing} // Biến trạng thái để hiển thị trạng thái đang làm mới
              onRefresh={handleRefresh} // Hàm xử lý khi người dùng kéo xuống
          />
        }
      >
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarContainer}>
            <Image source={{ uri: userData.avatar_url || profileImage }} style={styles.avatar} />
            <Text style={styles.editText}>SỬA</Text>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userData.display_name}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </View>
        </View>

        <View style={styles.settingsGroup}>
          {renderSettingItem('Thông tin cá nhân', '', () => navigation.navigate('Personal Information'))}
          {renderSettingItem('Thay đổi mật khẩu', '', () => navigation.navigate('Change Password'))}
        </View>

        <View style={styles.settingsGroup}>
          {renderSettingItem('Đặt mục tiêu')}
        </View>

        <View style={styles.settingsGroup}>
          {renderSettingItem('Other')}
        </View>

        <TouchableOpacity style={styles.footer} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      {renderImageOptionsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040D12',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  editText: {
    color: '#007AFF',
    fontSize: 12,
    marginTop: 4,
    top: -28
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    top: -45,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3A3A3C',
  },
  modalOptionText: {
    fontSize: 20,
    color: '#5d4ff8',
    textAlign: 'center',
  },

  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },

  settingsGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    top: -60
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  settingIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  logoutText: {
    color: '#E53935',
    fontSize: 20,
    padding: 10
  },
});