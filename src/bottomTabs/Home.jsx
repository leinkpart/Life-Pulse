import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { CircularProgress } from 'react-native-circular-progress';
import { supabase } from '../../supabaseClient';

const Home = ({ navigation }) => {
    const [currentDate, setCurrentDate] = useState('');
    const [userData, setUserData] = useState({ avatar_url: '', display_name: '' });
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [activities, setActivities] = useState([]);
    const [value, setValue] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);
    
    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) throw new Error('No user found');
        
            const { data, error } = await supabase
                .from('users')
                .select('avatar_url, display_name')
                .eq('user_id', user.id)
                .single();
        
            if (error) throw error;
        
            setUserData(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };
    
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    // const userSlide = () => {
    //     setMenuVisible(!isMenuVisible);
    // };

    useEffect(() => {
        const updateDate = () => {
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            setCurrentDate(`${month} ${day}, ${year}`);
        };

        updateDate();
        const intervalId = setInterval(updateDate, 1000);
        return () => clearInterval(intervalId);
    }, []);
   
    const Activity = ({ name, time, progress, icon }) => {
        return (
            <TouchableOpacity style={styles.activity} onPress={() => navigation.navigate(name)}>
                <Image source={icon} style={styles.icon} />

                <CircularProgress style={styles.circle}
                    size={90} 
                    width={10} 
                    fill={progress} 
                    tintColor="#4CAF50" 
                    backgroundColor="#E0E0E0" 
                    rotation={0} 
                    lineCap="round"
                >
                    {
                        (fill) => (
                            <View style={styles.progressInner}>                           
                                <Text style={styles.progressText}>{`${Math.round(fill)}%`}</Text>
                            </View>
                        )
                    }
                </CircularProgress>

                <View style={styles.info}>
                    <Text style={styles.time}>{time} min</Text>
                    <Text style={styles.name}>{name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.ContainerContent}>
                <View style={styles.header}>
                    <View style={styles.userHeader}>
                        <TouchableOpacity style={styles.userAvatar} onPress={() => navigation.openDrawer()}>
                            {userData && (
                                <>
                                    <Image
                                        source={{ uri: userData.avatar_url || '/placeholder.svg?height=100&width=100' }}
                                        style={{ width: 47, height: 47, borderRadius: '50%'}}
                                        resizeMode="cover"
                                    />
                                </>
                            )}
                        </TouchableOpacity>                                                

                        <View style={styles.headerCont}>
                            {userData && (
                                <>
                                    <Text style={styles.userText}>Hi, {userData.display_name} !</Text>
                                </>
                            )}                          
                            <View style={styles.headerContent}>
                                <Text style={styles.dateText}>{currentDate}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.notify}>
                        <TouchableOpacity style={styles.notifyContain} >
                            <Ionicons name='notifications-outline' style={styles.iconNotify} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.actTextCont}>Contents</Text>

                    <View style={styles.content}> 
                        <TouchableOpacity>
                        <ImageBackground 
                                source={require('../../assets/fitness1.jpg')}
                                style={{ width: '100%', height: '100%', 
                                    borderRadius: 30, 
                                    overflow: 'hidden',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                resizeMode="cover"
                            >       
                                <Text style={styles.contentText}>Workout of the day</Text>                           
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.actText}>Your Activities</Text>

                    <View style={styles.actContain}>
                        <Activity 
                            key={activities.id}
                            time={activities.duration}
                            progress={30} //activities.percentage
                            icon={require('../../assets/cycling.png')}
                            name="Cycling"
                        />
                        <Activity
                            name="Walking"
                            time={activities.duration}
                            progress={13} //activities.percentage
                            icon={require('../../assets/walking.png')}
                        />
                        <Activity
                            name="Fitness"
                            time={activities.duration}
                            progress={45} //activities.percentage
                            icon={require('../../assets/fitness2.png')}
                        />
                    </View>
                    
                    <Text style={styles.actText}>Features</Text>

                    <View style={styles.functionButton}>
                        <TouchableOpacity style={[styles.fButton, styles.button1]} onPress={() => navigation.navigate('Reminder')}>
                            <FontAwesome name="list-ul" style={styles.Icon} />
                            <Text style={styles.btnText}>Reminder</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.fButton, styles.button2]}>
                            <FontAwesome6 name="headphones-simple" style={styles.Icon} />
                            <Text style={styles.btnText}>Listening</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.functionButton}>
                        <TouchableOpacity style={[styles.fButton, styles.button3]}>
                            <FontAwesome6 name="glass-water" style={styles.Icon} />
                            <Text style={styles.btnText}>Water</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.fButton, styles.button4]} onPress={() => navigation.navigate('Setting')}>
                            <FontAwesome name="th-large" style={styles.Icon} />
                            <Text style={styles.btnText}>Unknown</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#eddfe0' 
    },

    scrollViewContent: {
        paddingBottom: 60,
    },

    overlay: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background mờ
        zIndex: 2,
    },

    header: { 
        flexDirection: 'row', 
        width: '100%', 
        height: 60, 
        backgroundColor: '#fff', 
        borderRadius: 15, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 20,
        paddingHorizontal: 20,
    },

    userHeader: { 
        flexDirection: 'row' 
    },

    headerCont: { 
        paddingLeft: 10, 
        paddingTop: 10 
    },

    headerContent: { 
        flexDirection: 'row', 
        alignItems: 'center',
    },

    dateText: { 
        fontSize: 14, 
        color: '#6439FF' 
    },

    userText: { 
        fontWeight: '700', 
        fontSize: 18, 
        color: '#55679C' 
    },

    userAvatar: { 
        backgroundColor: '#999', 
        borderRadius: '50%', 
        elevation: 5, 
        overflow: 'hidden',
        marginLeft: 5,
        justifyContent: 'center',
        height: 47,
        width: 47
    },

    notifyContain: { 
        height: 35, 
        width: 35, 
        backgroundColor: '#A8D1D1', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 20,
        elevation: 10,
        marginRight: -10
    },

    iconNotify: { 
        fontSize: 24, 
        color: '#000' 
    },

    actTextCont: {
        fontSize: 28, 
        fontWeight: '700', 
        color: '#222', 
        marginLeft: 20, 
        marginTop: 15,
    },

    content: { 
        margin: 20, 
        width: '90%', 
        height: 250, 
        backgroundColor: '#758694', 
        borderRadius: 30, 
        elevation: 3, 
        marginBottom: 10 
    },

    imageBackground: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'flex-end',
        padding: 10,
    },

    contentText: { 
        fontSize: 24, 
        color: 'white', 
        fontWeight: 'bold' 
    },

    actText: { 
        fontSize: 24, 
        color: '#222', 
        marginLeft: 20, 
        marginTop: 10 
    },

    actContain: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'row', 
        marginTop: 10,
    },

    activity: { 
        width: 120, 
        height: 'auto', 
        borderRadius: 10, 
        backgroundColor: '#fff', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.25, 
        shadowRadius: 0.84, 
        elevation: 1, 
        margin: 5, 
        paddingBottom: 10 
    },

    icon: { 
        width: 45, 
        height: 45, 
        marginBottom: 10, 
        margin: 10 
    },

    circle: {
        marginLeft: 15
    },

    progressInner: { 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    progressText: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#4CAF50', 
    },

    info: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 10,
    },

    name: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },

    time: { 
        fontSize: 16, 
        color: '#666' 
    },

    functionButton: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 10, 
    },

    fButton: { 
        flex: 1, 
        height: 'auto', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginHorizontal: 10, 
        paddingBottom: 10, 
        borderRadius: 20, 
        elevation: 2,
        paddingTop: 20, 
    },

    button1: { backgroundColor: '#E8B86D' },

    button2: { backgroundColor: '#00CCDD' },

    button3: { backgroundColor: '#4379F2' },

    button4: { backgroundColor: '#6A9C89' },

    Icon: { 
        fontSize: 40, 
        color: '#fff', 
        marginBottom: 5,
        paddingBottom: 10, 
    },

    btnText: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#fff' 
    },

    ContainerContent: { 
        flex: 1, 
        backgroundColor: '#EDDFE0', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30 
    },

    notify: {
        marginRight: 20,
    }
});

export default Home;