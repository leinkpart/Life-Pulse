import React, {useState, useEffect, useRef} from 'react';
import { 
    View, 
    Text,  
    Keyboard, 
    TextInput, 
    StyleSheet, 
    Pressable, 
    TouchableOpacity,
    Alert, 
    ScrollView, 
    } from 'react-native';
import { Switch, TouchableWithoutFeedback, Animated } from 'react-native';

import IconForward from 'react-native-vector-icons/Ionicons';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EditRemind = ({ navigation, route }) => {


    const { reminder, index } = route.params;
    const [title, setTitle] = useState(reminder?.title || '');
    const [description, setDescription] = useState(reminder?.description || '');
  
    const [isDateEnabled, setIsDateEnabled] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày hiện tại
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isTimeEnabled, setIsTimeEnabled] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date()); // Giờ hiện tại
    //const [showTimePicker, setShowTimePicker] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const animatedHeightDate = useRef(new Animated.Value(0)).current; 
    const animatedHeightTime = useRef(new Animated.Value(0)).current;
  
    // AddRemind.js
    const handleAdd = () => {
        const updatedReminder = {
            title,
            description,
            date: isDateEnabled ? selectedDate.toLocaleDateString('vi-VN') : '',
            time: isTimeEnabled ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
        };

        navigation.navigate('Reminder', { updatedReminder, index });

        // Reset lại form sau khi thêm
        setTitle('');
        setDescription('');
        setIsDateEnabled(false);
        setIsTimeEnabled(false);

        // Thông báo thành công
        Alert.alert('Notification', 'Add Successful Reminder!');
    };
 
    

    useEffect(() => {
        Animated.timing(animatedHeightDate, {
            toValue: isDateEnabled ? 95 : 0, // Adjust the height value as needed
            duration: 300, // Duration for the animation
            useNativeDriver: false,
        }).start();
    }, [isDateEnabled]);
    
    
    useEffect(() => {
        Animated.timing(animatedHeightTime, {
            toValue: isTimeEnabled ? 80 : 0, // Adjust the height value as needed
            duration: 300, // Duration for the animation
            useNativeDriver: false,
        }).start();
    }, [isTimeEnabled]);

    const toggleDateSwitch = () => setIsDateEnabled(previousState => !previousState);

    const toggleTimeSwitch = () => {
        setIsTimeEnabled((previousState) => {
            if (!previousState) {
                setIsDateEnabled(true);
            }
            return !previousState;
        });
    };

    const onChangeDate = (event, date) => {
        if (date) {
            const today = new Date();

            if (date < today) {
                Alert.alert('Error', 'The selected date cannot be less than the present date.');
                // Reset lại ngày hiện tại nếu ngày chọn nhỏ hơn ngày hiện tại
                setSelectedDate(today);
                setShowDatePicker(false); // Đóng picker lại sau khi reset
            } else {
                setSelectedDate(date); // Cập nhật nếu ngày hợp lệ
                setShowDatePicker(false); // Đóng picker lại sau khi chọn thành công
            }
        }
    };

    const showDate = () => {
        setShowDatePicker(true);
    };

    const showTime = () => {
        setTimePickerVisibility(true)
    };
    
    const hideTime = () => {
        setTimePickerVisibility(false)
    };
      
    const handleConfirm = (time) => {
        setSelectedTime(time);
        hideTime();
    };
  
    return (   
        <View style={styles.container}>
            <TouchableWithoutFeedback  onPress={() => Keyboard.dismiss()}>

                <View style={styles.headerAddReminder}>
                    <Pressable style={styles.btnClose} onPress={() => navigation.goBack()} >
                        <Text style={styles.CloseTxt}>Cancel</Text>
                    </Pressable>
        
                    <Text style={styles.newReminderTxt}>Edit reminder</Text>
                
                    <Pressable 
                        style={styles.btnAdd}
                        onPress={handleAdd}
                    >
                        <Text style={styles.AddTxt}>Done</Text>
                    </Pressable>
                </View>
            </TouchableWithoutFeedback>
    
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    <TextInput
                        style={styles.titleContent}
                        placeholder="Title"
                        placeholderTextColor="#777"
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
        
                    <View style={styles.separator} />
        
                    < ScrollView contentContainerStyle={styles.scrollNoteContent}>
                        <TextInput
                            style={styles.noteContent}
                            placeholder="Notes"
                            placeholderTextColor="#777"
                            multiline
                            numberOfLines={6}
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                        />
                    </ScrollView>
                </View>
    
                <View style={styles.detailContainer}>
                    <View style={styles.dateContainer}>
                        <View style={styles.iconText}>
                            <View style={styles.iconDays}>
                                <FontAwesome6 name="calendar-days" size={16} color="#fff" />
                            </View>
                            <Text style={styles.textTxt}>                              
                                Date
                            </Text>
                        </View>

                        <Switch
                            trackColor={{ false: "#B3C8CF", true: "#00C853" }}
                            thumbColor={isDateEnabled ? "#FEF9F2" : "#f4f3f4"}
                            onValueChange={toggleDateSwitch}
                            value={isDateEnabled}
                        />
                    </View>

                    <View style={styles.separator} />

                    <Animated.View style={[styles.calendarTimeContainer, { height: animatedHeightDate }]}>
                    {isDateEnabled && (
                        <>
                            <Text style={styles.selectedDateText}>
                                {selectedDate.toLocaleDateString('vi-VN')}
                            </Text>

                            <View style={styles.openDate}>
                                <Text style={styles.openPickerText} onPress={showDate}>
                                    Select day
                                </Text>

                                {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                    style={styles.datePicker}
                                />
                            )}
                            </View>
                        </>
                    )}
                    </Animated.View>

                    <View style={styles.timeContainer}>
                        <View style={styles.iconText}>
                            <View style={styles.iconTimes}>
                                <Ionicons name="time" size={20} color="#fff" />
                            </View>
                            <Text style={styles.textTxt}>                              
                                Time
                            </Text>
                        </View>

                        <Switch
                            trackColor={{ false: "#B3C8CF", true: "#00C853" }}
                            thumbColor={isTimeEnabled ? "#FEF9F2" : "#f4f3f4"}
                            onValueChange={toggleTimeSwitch}
                            value={isTimeEnabled}
                        />
                    </View>
                    
                    <View style={styles.separator} />

                    <Animated.View style={[styles.calendarTimeContainer, { height: animatedHeightTime }]}>
                    {isTimeEnabled && ( 
                        <>
                            <Text style={styles.selectedTimeText}>
                                {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>

                            <Text style={styles.openTimeText} onPress={showTime}>Select time</Text>
                            
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                mode="time"
                                onConfirm={handleConfirm}
                                onCancel={hideTime}
                                // Bạn có thể điều chỉnh giao diện của modal ở đây
                                // ví dụ: thêm style cho modal
                                time={selectedTime} // Chọn ngày mặc định
                                textColor="#FFFFFF" // Màu chữ trắng cho giao diện tối
                                //headerTextIOS="Chọn ngày"
                                isDarkModeEnabled={true}                         
                            />
                        </>
                    )}
                    </Animated.View>                  
                </View>

                <View style={styles.detailContainer}>
                    <TouchableOpacity style={styles.detailBtn} onPress={() => navigation.navigate('Repeat')} >
                        <View style={styles.iconText}>
                            <View style={styles.iconRepeat}>
                                <FontAwesome6 name="repeat" size={16} color="#fff" />
                            </View>
                            <Text style={styles.textTxt}>                              
                                Repeat
                            </Text>
                        </View>
                        <IconForward name="chevron-forward" style={styles.iconForward} />
                    </TouchableOpacity>
                </View>
    
            </ScrollView>
        </View>     
    );
};

const styles = StyleSheet.create({ 
    container: {
        backgroundColor: '#040D12',
        flex: 1
    },

    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRightHorizontal: 5
    },

    iconDays: {
        backgroundColor: '#ff4634',
        padding: 7,
        borderRadius: 7,
    },

    iconTimes: {
        backgroundColor: '#7a78ed',
        padding: 5,
        borderRadius: 7,
    },

    iconRepeat: {
        backgroundColor: '#7a78ed',
        padding: 7,
        borderRadius: 7,
    },
  
    headerAddReminder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 30,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 12,
        backgroundColor: '#1A1A1D',
        borderBottomWidth: 0.5,
        borderColor: 'gray'     
    },
  
    CloseTxt: {
        fontSize: 16,
        color: '#ff5c5c',
        fontWeight: '550'
    },
  
    newReminderTxt: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
    },
  
    AddTxtDisabled: {
        color: '#777',
        fontWeight: '650' 
    },
  
    AddTxt: {
        fontSize: 16,
        color: '#00C853',
        fontWeight: '650'
    },
  
    scrollContainer: {
        paddingBottom: 20
    },
  
    contentContainer: {
        backgroundColor: '#2c2c2d',
        borderRadius: 14,
        margin: 20,
        padding: 15,
        height: 205,
    },
  
    titleContent: {
        paddingLeft: 10,
        marginBottom: 10,
        borderRadius: 4,
        color: '#fff',
        fontSize: 20,
    },
  
    separator: {
        height: 1,
        backgroundColor: '#006666',
        marginBottom: 10,
    },
  
    scrollNoteContent: {
        height: 150,
    },
  
    noteContent: {
        padding: 10,
        marginBottom: 5,
        borderRadius: 4,
        color: '#fff',
        fontSize: 18,
    },

    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2c2c2d',
        paddingBottom: 15,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10,
    },

    textTxt: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 5
    },

    calendarTimeContainer: {
        backgroundColor: '#444',
        borderRadius: 10,
        // overflow: 'hidden',
    },

    selectedDateText: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10,
        paddingTop: 10,
        paddingLeft: 17,
        fontWeight: '500',
    },

    openDate: {
        flexDirection: 'row',
        paddingRight: 100,
        paddingLeft: 17,
    },
    
    openPickerText: {
        color: '#7a78ed',
        fontSize: 16,
    },

    datePicker: {
        width: '100%',
    },

    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        backgroundColor: '#2c2c2d',
        paddingBottom: 15,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10,
    },
    
    selectedTimeText: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10,
        paddingTop: 10,
        paddingLeft: 17,
        fontWeight: '500',  
    },
    
    detailContainer: {
        padding: 20,
        backgroundColor: '#2c2c2d',
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 14,
        marginBottom: 15,
    },

    openTimeText: {
        color: '#7a78ed',
        fontSize: 16,
        paddingLeft: 17
    },
  
    detailBtn: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
  
    iconForward: {
        color: '#000',
        fontSize: 20,
        paddingTop: 7,
    },
  
});
  
export default EditRemind
