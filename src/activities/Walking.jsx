'use client'

import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { Pedometer } from 'expo-sensors'
import { LineChart } from 'react-native-chart-kit'
import Svg, { Circle } from 'react-native-svg'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function Component() {
    const [steps, setSteps] = useState(0)
    const [selectedTab, setSelectedTab] = useState('daily') // Track the selected tab
    const goal = 18000
    const progress = (steps / goal) * 100
  
    const [data, setData] = useState({
      daily: [0, 1000, 2000, 1500, 2500, 3000, 2800],
      weekly: [7000, 8000, 9000, 10000, 11000, 12000, 13000],
      monthly: [40000, 42000, 45000, 47000, 50000, 52000, 54000],
      yearly: [300000, 320000, 340000, 360000, 380000, 400000, 420000]
    })

    const calculateDistance = steps => (steps * 0.0008).toFixed(3)  // distance in km
    const calculateCalories = steps => (steps * 0.04).toFixed(0)    // kcal burned
    const calculateTime = steps => Math.floor(steps / 100)

    const progressCalories = (steps) => {
        const caloriesBurned = calculateCalories(steps);
        const goalCalories = 720; // Giả sử mục tiêu là 720 kcal
        return (caloriesBurned / goalCalories) * 100;
    }
      
    const progressDistance = (steps) => {
        const distanceCovered = calculateDistance(steps);
        const goalDistance = 14.4; // Giả sử mục tiêu là 14.4 km
        return (distanceCovered / goalDistance) * 100;
    }
      
    const progressTime = (steps) => {
        const timeSpent = calculateTime(steps);
        const goalTime = 180; // Giả sử mục tiêu là 180 phút
        return (timeSpent / goalTime) * 100;
    }

    useEffect(() => {
        let intervalId;
    
        const fetchStepCount = async () => {
          try {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            const result = await Pedometer.getStepCountAsync(startOfDay, now);
            if (result) {
              setSteps(result.steps);
            }
          } catch (error) {
            console.log("Error fetching step count: ", error);
          }
        };
    
        // Cập nhật bước mỗi 5 giây (có thể điều chỉnh)
        intervalId = setInterval(fetchStepCount, 2000);
    
        return () => clearInterval(intervalId); // Xóa bỏ interval khi component unmount
    }, []);    

    useEffect(() => {
        let subscription;
    
        // Kiểm tra Pedometer có khả dụng không
        Pedometer.isAvailableAsync().then(
          (result) => {
            console.log("Pedometer available: ", result); // Kiểm tra kết quả trả về
            if (result) {
              // Bắt đầu đăng ký cập nhật bước chân
              subscription = Pedometer.watchStepCount(result => {
                console.log("Steps detected: ", result.steps); // Log số bước đã đếm
                setSteps(result.steps);
              });
            } else {
              console.log("Pedometer is not available on this device.");
            }
          },
          (error) => {
            console.log("Error checking pedometer availability: ", error);
          }
        );
    
        // Cleanup đăng ký khi component bị hủy
        return () => {
          if (subscription) {
            subscription.remove();
          }
        };
    }, []);    
      

  const CircularProgress = ({ size, strokeWidth, progress }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <Svg width={size} height={size}>
        <Circle
          stroke="#E6E6FF"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#6C63FF"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
    )
  }

  const getLabels = () => {
    switch (selectedTab) {
      case 'daily':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      case 'weekly':
        return ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']
      case 'monthly':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      case 'yearly':
        return ['2020', '2021', '2022', '2023', '2024', '2025', '2026']
      default:
        return []
    }
  }

  const getData = () => {
    return data[selectedTab]
  }

  return (
      <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>DAILY STEPS</Text>
        <Text style={styles.subtitle}>
          You have walked <Text style={styles.highlight}>{Math.round(progress)}%</Text> of your goal
        </Text>

        <View style={styles.progressContainer}>
          <CircularProgress size={250} strokeWidth={20} progress={progress} />
          <View style={styles.stepsContainer}>
            <MaterialCommunityIcons name="walk" size={24} color="#6C63FF" />
            <Text style={styles.stepsText}>{steps}</Text>
            <Text style={styles.stepsLabel}>steps</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <CircularProgress size={60} strokeWidth={5} progress={progressCalories(steps)} />
            <Text style={styles.statValue}>{calculateCalories(steps)} kcal</Text>
          </View>
          <View style={styles.stat}>
            <CircularProgress size={60} strokeWidth={5} progress={progressDistance(steps)} />
            <Text style={styles.statValue}>{calculateDistance(steps)} km</Text>
          </View>
          <View style={styles.stat}>
            <CircularProgress size={60} strokeWidth={5} progress={progressTime(steps)} />
            <Text style={styles.statValue}>{calculateTime(steps)} min</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
        <View style={styles.tabs}>
          {['daily', 'weekly', 'monthly', 'yearly'].map(tab => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <Text style={[styles.tab, selectedTab === tab && styles.activeTab]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
          <LineChart
            data={{
                labels: getLabels(),
                datasets: [{ data: getData() }]
              }}
            width={Dimensions.get('window').width - 40}
            height={180}
            chartConfig={{
              backgroundColor: '#F8F7FF',
              backgroundGradientFrom: '#F8F7FF',
              backgroundGradientTo: '#F8F7FF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>
    </ScrollView>
      </View>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Extra padding for scrolling
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
  },
  title: {
    fontSize: 16,
    color: '#6C63FF',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  highlight: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  stepsContainer: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
  },
  stepsText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  stepsLabel: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    marginTop: 30,
    backgroundColor: '#F8F7FF',
    borderRadius: 20,
    padding: 15,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tab: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 12,
  },
  activeTab: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
})
