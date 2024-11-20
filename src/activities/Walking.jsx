'use client'

import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { Pedometer } from 'expo-sensors'
import { LineChart } from 'react-native-chart-kit'
import Svg, { Circle } from 'react-native-svg'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { supabase } from '../../supabaseClient'

export default function Component() {
    const [steps, setSteps] = useState(0)
    const [selectedTab, setSelectedTab] = useState('daily') // Track the selected tab
    const goal = 18000
    const progress = (steps / goal) * 100
  
    const [chartData, setChartData] = useState({ daily: [], weekly: [], monthly: [] });

    const calculateDistance = steps => (steps * 0.00075).toFixed(3)  // distance in km
    const calculateCalories = steps => (steps * 0.04).toFixed(0)    // kcal burned
    const calculateTime = steps => Math.floor(steps / 100)

    const fetchStepData = async () => {
      try {
        const { data, error } = await supabase
          .from('steps')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) throw error;
  
        const daily = data.slice(-7).map((item) => item.steps);
        const weekly = data.slice(-28).reduce((acc, item, index) => {
          const weekIndex = Math.floor(index / 7);
          if (!acc[weekIndex]) acc[weekIndex] = 0;
          acc[weekIndex] += item.steps;
          return acc;
        }, []);
        const monthly = data.slice(-84).reduce((acc, item, index) => {
          const monthIndex = Math.floor(index / 28);
          if (!acc[monthIndex]) acc[monthIndex] = 0;
          acc[monthIndex] += item.steps;
          return acc;
        }, []);
  
        setChartData({ daily, weekly, monthly });
      } catch (error) {
        console.error('Error fetching steps:', error);
      }
    };

    // Lưu dữ liệu bước chân vào Supabase
    const saveStepsToSupabase = async (steps) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Không tìm thấy thông tin người dùng');
    
        const today = new Date().toISOString().split('T')[0];
        const { error } = await supabase
          .from('steps')
          .upsert({ 
            date: today, 
            steps: steps,
            user_id: user.id  // Thêm user_id vào đây
          }, { onConflict: 'date,user_id' });
    
        if (error) throw error;
      } catch (error) {
        console.error('Lỗi khi lưu số bước chân:', error);
        Alert.alert('Lỗi', 'Không thể lưu số bước chân. Vui lòng thử lại.');
      }
    };

    useEffect(() => {
      let subscription;
      const startPedometerUpdates = async () => {
        try {
          const isAvailable = await Pedometer.isAvailableAsync();
          if (isAvailable) {
            const end = new Date();
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const result = await Pedometer.getStepCountAsync(start, end);
            if (result) {
              setSteps(result.steps);
            }
            subscription = Pedometer.watchStepCount(result => {
              setSteps(prevSteps => prevSteps + result.steps);
            });
          } else {
            console.log("Pedometer is not available on this device.");
          }
        } catch (error) {
          console.log("Error setting up pedometer:", error);
        }
      };
  
      startPedometerUpdates();
      fetchStepData();
  
      const intervalId = setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
          saveStepsToSupabase(steps);
          setSteps(0);
        }
      }, 60000);
  
      return () => {
        if (subscription) {
          subscription.remove();
        }
        clearInterval(intervalId);
      };
    }, []);
  
    useEffect(() => {
      saveStepsToSupabase(steps);
    }, [steps]);

    const getLabels = () => {
      switch (selectedTab) {
        case 'daily':
          return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        case 'weekly':
          return ['W1', 'W2', 'W3', 'W4'];
        case 'monthly':
          return ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
        default:
          return [];
      }
    };
  
    const getData = () => {
      return chartData[selectedTab];
    };
  
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
            <MaterialCommunityIcons name="walk" size={38} color="#E91E63" marginTop={-15} />
            <Text style={styles.stepsText}>{steps}</Text>
            <Text style={styles.stepsLabel}>steps</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <CircularProgress size={60} strokeWidth={5} progress={(calculateCalories(steps) / 720) * 100} />
            <Text style={styles.statValue}>{calculateCalories(steps)} kcal</Text>
          </View>
          <View style={styles.stat}>
            <CircularProgress size={60} strokeWidth={5} progress={(calculateDistance(steps) / 14.4) * 100} />
            <Text style={styles.statValue}>{calculateDistance(steps)} km</Text>
          </View>
          <View style={styles.stat}>
            <CircularProgress size={60} strokeWidth={5} progress={(calculateTime(steps) / 180) * 100} />
            <Text style={styles.statValue}>{calculateTime(steps)} min</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
        <View style={styles.tabs}>
          {['daily', 'weekly', 'monthly'].map(tab => (
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
            width={Dimensions.get('window').width - 30}
            height={180}
            chartConfig={{
              backgroundColor: '#4c4c4d',
              backgroundGradientFrom: '#4c4c4d',
              backgroundGradientTo: '#4c4c4d',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
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
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#040D12',
    // padding: 20,
  },
  title: {
    fontSize: 16,
    color: '#6C63FF',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    color: '#fff'
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
    color: '#fff'
  },
  stepsLabel: {
    fontSize: 16,
    color: '#999',
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
    color: '#999',
  },
  chartContainer: {
    marginTop: 30,
    backgroundColor: '#4c4c4d',
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
    color: '#999',
    fontSize: 14,
  },
  activeTab: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
})
