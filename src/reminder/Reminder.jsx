import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    Keyboard, 
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, Ionicons, AntDesign} from '@expo/vector-icons';


const Reminder = ({ navigation, route, onDelete }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        // Nếu có lời nhắc mới từ màn hình AddRemind, thêm nó vào danh sách
        if (route.params?.newReminder) {
            setReminders(prevReminders => [...prevReminders, route.params.newReminder]);
        }
    }, [route.params?.newReminder]);

    useEffect(() => {
        if (route.params?.updatedReminder !== undefined && route.params?.index !== undefined) {
            setReminders((prevReminders) => {
                const newReminders = [...prevReminders];
                newReminders[route.params.index] = route.params.updatedReminder;
                return newReminders;
            });
        }
    }, [route.params?.updatedReminder, route.params?.index]);
  
    const [selectedTab, setSelectedTab] = useState('today'); 
    
    const handleSearch = (text) => {
        setSearchQuery(text);
    };
  
    const handleDismissKeyboard = () => {
        Keyboard.dismiss();
    };
  
    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };
    
    // Hàm để xóa lời nhắc
    const deleteReminder = (index) => {
        const newReminders = [...reminders];
        newReminders.splice(index, 1);
        setReminders(newReminders);
    };

    // Hàm hiển thị alert khi người dùng vuốt ngang
    const showDeleteAlert = (index) => {
        Alert.alert(
            "Xóa lời nhắc",
            "Bạn có muốn xóa lời nhắc này không?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => deleteReminder(index) }
            ]
        );
    };

    // Hiển thị alert khi xác nhận sửa
    const showEditAlert = (index) => {
        Alert.alert(
            "Sửa lời nhắc",
            "Bạn có muốn sửa lời nhắc này không?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => navigation.navigate('EditRemind', { reminder: reminders[index], index }) }
            ]
        );
    };

    // Render từng lời nhắc
    const renderItem = ({ item, index }) => (
        <Swipeable
            // onSwipeableWillOpen={() => deleteReminder(index)}
            renderRightActions={(progress, dragX) => {
                const deleteOpacity = dragX.interpolate({
                    inputRange: [-150, -100, -85],
                    outputRange: [1, 1, 0.7],
                    extrapolate: 'clamp',
                });

                if (progress > -0.95) {  // Kiểm tra nếu vuốt qua 65%
                    showDeleteAlert(index); // Hiện alert xóa
                }

                return (
                    <TouchableOpacity 
                        style={[styles.deleteButton, { opacity: deleteOpacity }]} 
                        onPress={() => showDeleteAlert(index)} // Hiển thị alert khi nhấn nút "Xóa"
                    >
                        <Ionicons name="trash" size={24} color="#fff" />
                    </TouchableOpacity>
                );
            }}
            renderLeftActions={() => (
                <TouchableOpacity style={styles.editButton} onPress={() => showEditAlert(index)}>
                    <AntDesign name="edit" size={24} color="#fff" />
                </TouchableOpacity>
            )}
        >
            <View style={styles.reminderItem}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderDescription}>{item.description}</Text>
                <Text style={styles.reminderDate}>{item.date}</Text>
                <Text style={styles.reminderTime}>{item.time}</Text>
            </View>
        </Swipeable>
    );
  
    const filteredReminders = reminders.filter((reminder) => {
        return reminder.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

  
    const remindersToDisplay = () => {
        const today = new Date().toLocaleDateString();

        switch (selectedTab) {
            case 'today':
                return filteredReminders.filter(reminder => reminder.date === today);
            case 'scheduled':
                return filteredReminders.filter(reminder => reminder.date > new Date());
            case 'all':
                return filteredReminders;
            default:
                return filteredReminders;
        }
    };
  
    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <MaterialCommunityIcons name="magnify" size={30} color="#c0c0c0" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#777"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
    
            <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        onPress={() => handleTabPress('today')}
                        style={[styles.tab, selectedTab === 'today' && styles.activeTab]}
                    >
                        <View style={[styles.iconRepeat, {backgroundColor: selectedTab === 'today' ? '#ff4634' : '#f88c93',}]}>
                            <MaterialCommunityIcons
                                name="calendar-today"
                                size={24}
                                color={selectedTab === 'today' ? '#fff' : '#D8D9CF'}
                            />
                        </View>
                        <Text
                            style={[
                            styles.tabText,
                            {
                                color: selectedTab === 'today' ? '#fff' : '#666',
                                fontWeight: selectedTab === 'today' ? 'bold' : 'normal'
                            }
                            ]}
                        >
                            Today
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={() => handleTabPress('scheduled')}
                        style={[styles.tab, selectedTab === 'scheduled' && styles.activeTab]}
                    >
                        <View style={[styles.iconRepeat, {backgroundColor: selectedTab === 'scheduled' ? '#1b0ffa' : '#8c9ef8',}]}>
                            <MaterialCommunityIcons
                                name="calendar-check"
                                size={24}
                                color={selectedTab === 'scheduled' ? '#fff' : '#D8D9CF'}
                            />
                        </View>
                        <Text
                            style={[styles.tabText,
                            {
                                color: selectedTab === 'scheduled' ? '#fff' : '#666',
                                fontWeight: selectedTab === 'scheduled' ? 'bold' : 'normal'
                            }
                            ]}
                            >
                            Scheduled
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleTabPress('all')}
                        style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
                    >
                        <View style={[styles.iconRepeat, {backgroundColor: selectedTab === 'all' ? '#9e36ce' : '#e28cf8',}]}>                          
                            <MaterialCommunityIcons
                                name="calendar-month-outline"
                                size={24}
                                color={selectedTab === 'all' ? '#fff' : '#D8D9CF'}
                            />
                        </View>
                        <Text
                            style={[styles.tabText,
                            {
                                color: selectedTab === 'all' ? '#fff' : '#666',
                                fontWeight: selectedTab === 'all' ? 'bold' : 'normal'
                            }
                            ]}
                            >
                            All
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
    
            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>My lists</Text>
                <FlatList
                    data={remindersToDisplay()}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}                   
                    ListEmptyComponent={() => <Text style={styles.emptyText}>No reminder.</Text>}
                />
            </View>
    
            <TouchableOpacity style={styles.addReminderButton} onPress={() => navigation.navigate('AddRemind')}>
                <MaterialCommunityIcons name="plus-circle" size={32} color="#fff" />
            </TouchableOpacity>       
        </View>
    );
};

const styles = StyleSheet.create({
    iconRepeat: {
        padding: 7,
        borderRadius: 20,
        marginTop: -5,
        marginLeft: -65
    },

    container: {
        flex: 1,
        backgroundColor: '#eddfe0',
        padding: 16,
    },

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 16,
        elevation: 2,
    },

    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 18,
        color: '#000',
    },

    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },

    tab: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        elevation: 1,
        width: 115
    },

    activeTab: {
        backgroundColor: '#0E8388',
    },

    tabText: {
        color: '#fff',
        fontSize: 18,
    },

    activeTabText: {
        fontWeight: 'bold',
    },

    listContainer: {
        paddingBottom: 190
    },

    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },

    reminderItem: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 3,
        elevation: 1,
    },

    reminderTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },

    reminderDate: {
        fontSize: 16,
        fontWeight: '400',
        color: '#111',
    },

    reminderTime: {
        fontSize: 14,
        fontWeight: '400',
        color: '#111',
    },

    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
        marginTop: 20,
    },

    addReminderButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#00C853',
        borderRadius: 50,
        padding: 16,
        elevation: 10,
    },

    // Các style của Swiper Remove
    deleteButton: {
        backgroundColor: '#ff3b30',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: '50%',
        height: '97%',
        borderRadius: 10,
        paddingRight: 40
    },

    // Cac style cuar Swiper Edit
    editButton: {
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '50%',
        height: '97%',
        borderRadius: 10,
        paddingLeft: 40
    },
});

export default Reminder;