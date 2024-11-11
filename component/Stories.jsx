import React from 'react'
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity} from 'react-native'
import USERS from '../data/Users'

const Stories = () => {
    return (
        <View style={{marginTop: 10, marginBottom: 20}}>
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}          
            >
                {USERS.map((story, index) => (
                    <View key={index} >
                        <TouchableOpacity style={{ alignItems: 'center'}}>
                            <Image source={{uri: story.image}} style={styles.story}/>
                            <Text style={{color: 'white', paddingTop: 5}}>
                            {
                                story.userName.length > 10 ? story.userName.slice(0, 9).toLowerCase() + '...'
                                : story.userName.toLowerCase()
                            }</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    story: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        borderWidth: 3, 
        marginHorizontal: 7,
        borderColor: '#ff8501',
    }
})

export default Stories