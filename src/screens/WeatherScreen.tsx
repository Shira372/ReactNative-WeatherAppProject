import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { fetchCurrentWeather, fetchWeatherForecast } from '../services/api';
import { RootStackParamList, WeatherData, ForecastData } from '../../types/types';
import LoadingIndicator from '../components/LoadingIndicator';
import WeatherCard from '../components/WeatherCard';
import { getWeatherIconName } from '../utils/helpers';

type WeatherScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tabs'>;

const WeatherScreen = () => {
  const [city, setCity] = useState('Jerusalem');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<WeatherScreenNavigationProp>();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  const loadWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchCurrentWeather(cityName);
      setCurrentWeather(weatherData);
      
      const forecastData = await fetchWeatherForecast(cityName);
      setForecast(forecastData);
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
      
    } catch (err) {
      setError('Failed to load weather data. Please check the city name and try again.');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(city);
  }, []);

  const handleSearch = () => {
    if (city.trim()) {
      loadWeatherData(city);
    }
  };

  const navigateToDetails = () => {
    if (currentWeather) {
      navigation.navigate('Details', { weather: currentWeather });
    }
  };

  const renderForecastItem = ({ item }: { item: any }) => {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastDay}>{dayName}</Text>
          <Text style={styles.forecastTime}>{time}</Text>
          <View style={styles.forecastIconContainer}>
            <Icon 
              name={getWeatherIconName(item.weather[0].main)} 
              size={32} 
              color={colors.primary} 
            />
          </View>
          <Text style={styles.forecastTemp}>{Math.round(item.main.temp)}°C</Text>
          <Text style={styles.forecastDesc}>{item.weather[0].description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={handleSearch}
          right={<TextInput.Icon icon="magnify" onPress={handleSearch} />}
        />
      </View>

      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={handleSearch} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      ) : currentWeather ? (
        <Animated.View 
          style={[
            styles.weatherContainer, 
            { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }
          ]}
        >
          <WeatherCard 
            weather={currentWeather} 
            onPress={navigateToDetails}
          />
          
          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>5-Day Forecast</Text>
            {forecast && (
              <FlatList
                data={forecast.list.slice(0, 10)}
                renderItem={renderForecastItem}
                keyExtractor={(item) => item.dt.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.forecastList}
              />
            )}
          </View>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.lightBackground,
    height: 50,
  },
  weatherContainer: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
  },
  forecastContainer: {
    marginTop: 24,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  forecastList: {
    paddingRight: 16,
  },
  forecastCard: {
    width: 110,
    marginRight: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
    elevation: 2,
    alignItems: 'center',
  },
  forecastDay: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.textPrimary,
  },
  forecastTime: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  forecastIconContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  forecastDesc: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default WeatherScreen;