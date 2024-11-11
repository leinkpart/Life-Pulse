import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';

import {Feather, Octicons} from '@expo/vector-icons'

const HeaderPost = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity>             
                <Text style={styles.logo}>VanzLynk</Text>
            </TouchableOpacity>

            <View style={styles.iconContainer} >
                <TouchableOpacity >
                    <Feather name='plus-square' size={24} color="#999" style={styles.icon} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <View style={styles.unread}>
                        <Octicons name='dot-fill' size={14} color="#fff" style={styles.dot} />
                    </View>
                    <Feather name='heart' size={24} color="#999" style={styles.icon} />
                </TouchableOpacity>

                {/* <TouchableOpacity>
                    <Feather name='plus-square' size={24} color="#fff" style={styles.icon} />
                </TouchableOpacity> */}
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 10,
    },

    iconContainer: {
        flexDirection: 'row'
    },

    logo: {
        color: '#3B82F6',
        fontSize: 20,
        fontWeight: 'bold',
    },

    icon: {
        marginHorizontal: 10,
    },

    unread: {
        backgroundColor: '#ff4634',
        position: 'absolute',
        left: 25,
        top: -2,
        zIndex: 2,
        width: 13,
        height: 13,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },

    dot: {
        left: 0.3,
        bottom: 0.5
    }
})

export default HeaderPost
