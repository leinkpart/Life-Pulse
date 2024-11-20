import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

const Repeat = ({ navigation }) => {
    const [selectedOption, setSelectedOption] = useState('None'); // Default selected option
  
    const repeatOptions = [
      'None',
      'Every day',
      'Normal day',
      'Weekend',
      'Every week',
      'Every 2 weeks',
      'Every months',
      'Every 3 months',
      'Every 6 months',
      'Every year',
    ];
  
    const handleSelectOption = (option) => {
      setSelectedOption(option);
      setTimeout(() => {
          navigation.goBack();
        }, 100); 
    };
  
    const renderOption = ({ item }) => (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleSelectOption(item)}
      >
        <Text style={styles.optionText}>{item}</Text>
        {selectedOption === item && (
          <Icon name="checkmark" size={24} color="#7a78ed" />
        )}
      </TouchableOpacity>
    );
  
    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <FlatList
                    data={repeatOptions}
                    keyExtractor={(item) => item}
                    renderItem={renderOption}
                    showsVerticalScrollIndicator={false}
                />
            </View>
    
            <View style={styles.customContainer}>
                <TouchableOpacity style={styles.customBtn} >
                    <Text style={styles.customText}>Custom</Text>
                    <Icon  name="chevron-forward" style={styles.iconForward} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#040D12',
        padding: 15,
    },
    
    contentContainer: {
        padding: 20,
        backgroundColor: '#2c2c2d',
        borderRadius: 15
    },
  
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomColor: '#777',
        borderBottomWidth: 1,
    },

    optionText: {
        fontSize: 16,
        color: '#fff',
    },
  
    customContainer: {
        padding: 20,
        backgroundColor: '#2c2c2d',
        marginTop: 20,
        borderRadius: 14,
    },
  
    customBtn: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
  
    customText: {
        color: '#fff',
        fontSize: 18,
    },
  
    iconForward: {
        color: '#999',
        fontSize: 20,
    }
  
});
  
export default Repeat;