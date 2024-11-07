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

import IconForward from 'react-native-vector-icons/Ionicons'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'

import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddRemind = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
  
    // AddRemind.js
    const handleAdd = () => {
        if (!isTitleEmpty) {
            const newReminder = {
                title: title,
                description: description,
                date: isDateEnabled ? selectedDate.toLocaleDateString('vi-VN') : '',
                time: isTimeEnabled ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
            };
            
            // Truyền dữ liệu về ReminderList
            navigation.navigate('Reminder', { newReminder });

            // Reset lại form sau khi thêm
            setTitle('');
            setDescription('');
            setIsDateEnabled(false);
            setIsTimeEnabled(false);

            // Thông báo thành công
            Alert.alert('Notification', 'Add Successful Reminder!');
        } else {
            Alert.alert('Error', 'Title cannot be empty.');
        }
    };
 
    const isTitleEmpty = title.trim() === '';
  
    const [isDateEnabled, setIsDateEnabled] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày hiện tại
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isTimeEnabled, setIsTimeEnabled] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date()); // Giờ hiện tại
    //const [showTimePicker, setShowTimePicker] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const animatedHeightDate = useRef(new Animated.Value(0)).current; 
    const animatedHeightTime = useRef(new Animated.Value(0)).current;

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
        
                    <Text style={styles.newReminderTxt}>New reminder</Text>
                
                    <Pressable 
                        style={styles.btnAdd}
                        onPress={handleAdd}
                        disabled={isTitleEmpty}>
                        <Text style={[styles.AddTxt, isTitleEmpty && styles.AddTxtDisabled]}>Add</Text>
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
                        <Text style={styles.dayText}>
                            <View style={styles.iconDays}>
                                <FontAwesome6 name="calendar-days" size={16} color="#fff" />
                            </View>
                            Date
                        </Text>
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
                        <Text style={styles.timeText}>
                            <View style={styles.iconTimes}>
                                <Ionicons name="time" size={20} color="#fff" />
                            </View>
                            Time
                        </Text>
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
                        <Text style={styles.detailText}>
                            <View style={styles.iconRepeat}>
                                <FontAwesome6 name="repeat" size={16} color="#fff" />
                            </View>
                            Repeat
                        </Text>
                        <IconForward name="chevron-forward" style={styles.iconForward} />
                    </TouchableOpacity>
                </View>
    
            </ScrollView>
        </View>     
    );
};

const styles = StyleSheet.create({ 
    container: {
        backgroundColor: '#eddfe0',
        flex: 1
    },

    iconDays: {
        backgroundColor: '#ff4634',
        padding: 7,
        borderRadius: 7,
        marginTop: -7,
        marginRight: 5
    },

    iconTimes: {
        backgroundColor: '#7a78ed',
        padding: 5,
        borderRadius: 7,
        marginTop: -7,
        marginRight: 5
    },

    iconRepeat: {
        backgroundColor: '#7a78ed',
        padding: 7,
        borderRadius: 7,
        marginTop: -7,
        marginRight: 5,
    },
  
    headerAddReminder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 30,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 12,
        backgroundColor: '#fff',
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
        color: '#000',
        fontWeight: '700',
    },
  
    AddTxtDisabled: {
        color: '#777', 
    },
  
    AddTxt: {
        fontSize: 16,
        color: '#00C853',
        fontWeight: '550'
    },
  
    scrollContainer: {
        paddingBottom: 20
    },
  
    contentContainer: {
        backgroundColor: '#fff',
        borderRadius: 14,
        margin: 20,
        padding: 15,
        height: 205,
    },
  
    titleContent: {
        paddingLeft: 10,
        marginBottom: 10,
        borderRadius: 4,
        color: '#000',
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
        color: '#000',
        fontSize: 18,
    },

    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 15,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10,
    },

    dayText: {
        color: '#000',
        fontSize: 18,
    },

    calendarTimeContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        overflow: 'hidden',
    },

    selectedDateText: {
        color: '#000',
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
        backgroundColor: '#fff',
        paddingBottom: 15,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10,
    },
    
    timeText: {
        color: '#000',
        fontSize: 18,
    },
    
    selectedTimeText: {
        color: '#000',
        fontSize: 18,
        marginBottom: 10,
        paddingTop: 10,
        paddingLeft: 17,
        fontWeight: '500',  
    },
    
  
    detailContainer: {
        padding: 20,
        backgroundColor: '#fff',
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
  
    detailText: {
        color: '#000',
        fontSize: 18,
        marginLeft: 7
    },
  
    iconForward: {
        color: '#000',
        fontSize: 20,
        paddingTop: 7,
    },
  
});
  
export default AddRemind
