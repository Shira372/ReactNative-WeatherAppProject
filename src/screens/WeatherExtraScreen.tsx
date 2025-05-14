import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Title, ProgressBar, Button, TextInput } from 'react-native-paper';
import { colors } from '../theme/colors';
import { fetchAirQuality, fetchUvIndex } from '../services/api';
import { AirQualityData, UvIndexData } from '../../types/types';
import LoadingIndicator from '../components/LoadingIndicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withSpring,
  Easing
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const WeatherExtraScreen = () => {
  const [city, setCity] = useState('Jerusalem');
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [uvIndex, setUvIndex] = useState<UvIndexData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use Reanimated 2 shared values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }]
    };
  });

  const loadExtraData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const airQualityData = await fetchAirQuality(cityName);
      setAirQuality(airQualityData);
      
      const uvIndexData = await fetchUvIndex(cityName);
      setUvIndex(uvIndexData);
      
      // Trigger animations with Reanimated 2
      opacity.value = withTiming(1, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
      
    } catch (err) {
      setError('Failed to load weather data. Please check the city name and try again.');
      console.error('Error fetching extra weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExtraData(city);
  }, []);

  const handleSearch = () => {
    if (city.trim()) {
      loadExtraData(city);
    }
  };

  const getAirQualityLevel = (aqi: number) => {
    if (aqi <= 50) return { level: 'Good', color: '#00E400' };
    if (aqi <= 100) return { level: 'Moderate', color: '#FFFF00' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#FF7E00' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#FF0000' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#99004C' };
    return { level: 'Hazardous', color: '#7E0023' };
  };

  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: '#299501' };
    if (uv <= 5) return { level: 'Moderate', color: '#F7E400' };
    if (uv <= 7) return { level: 'High', color: '#F85900' };
    if (uv <= 10) return { level: 'Very High', color: '#D80011' };
    return { level: 'Extreme', color: '#6B49C8' };
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
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.content, animatedStyle]}>
            {airQuality && (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Icon name="air-filter" size={32} color={colors.primary} />
                    <Title style={styles.cardTitle}>Air Quality</Title>
                  </View>
                  
                  <View style={styles.aqiContainer}>
                    <View style={[styles.aqiCircle, { backgroundColor: getAirQualityLevel(airQuality.aqi).color }]}>
                      <Text style={styles.aqiValue}>{airQuality.aqi}</Text>
                    </View>
                    <Text style={styles.aqiLabel}>{getAirQualityLevel(airQuality.aqi).level}</Text>
                  </View>
                  
                  <View style={styles.pollutantsContainer}>
                    <Text style={styles.sectionTitle}>Pollutants</Text>
                    
                    <View style={styles.pollutant}>
                      <Text style={styles.pollutantName}>PM2.5</Text>
                      <ProgressBar 
                        progress={airQuality.pm25 / 100} 
                        color={colors.primary}
                        style={styles.progressBar} 
                      />
                      <Text style={styles.pollutantValue}>{airQuality.pm25} µg/m³</Text>
                    </View>
                    
                    <View style={styles.pollutant}>
                      <Text style={styles.pollutantName}>PM10</Text>
                      <ProgressBar 
                        progress={airQuality.pm10 / 150} 
                        color={colors.primary}
                        style={styles.progressBar} 
                      />
                      <Text style={styles.pollutantValue}>{airQuality.pm10} µg/m³</Text>
                    </View>
                    
                    <View style={styles.pollutant}>
                      <Text style={styles.pollutantName}>NO2</Text>
                      <ProgressBar 
                        progress={airQuality.no2 / 200} 
                        color={colors.primary}
                        style={styles.progressBar} 
                      />
                      <Text style={styles.pollutantValue}>{airQuality.no2} µg/m³</Text>
                    </View>
                    
                    <View style={styles.pollutant}>
                      <Text style={styles.pollutantName}>O3</Text>
                      <ProgressBar 
                        progress={airQuality.o3 / 180} 
                        color={colors.primary}
                        style={styles.progressBar} 
                      />
                      <Text style={styles.pollutantValue}>{airQuality.o3} µg/m³</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            )}
            
            {uvIndex && (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Icon name="weather-sunny-alert" size={32} color={colors.primary} />
                    <Title style={styles.cardTitle}>UV Index</Title>
                  </View>
                  
                  <View style={styles.uvContainer}>
                    <View style={[styles.uvCircle, { backgroundColor: getUvLevel(uvIndex.value).color }]}>
                      <Text style={styles.uvValue}>{uvIndex.value}</Text>
                    </View>
                    <Text style={styles.uvLabel}>{getUvLevel(uvIndex.value).level}</Text>
                  </View>
                  
                  <View style={styles.uvInfoContainer}>
                    <Text style={styles.sectionTitle}>Protection Needed</Text>
                    <View style={styles.uvInfo}>
                      <Icon name="account" size={24} color={colors.textSecondary} />
                      <Text style={styles.uvInfoText}>
                        {uvIndex.value > 2 ? 'Apply SPF 30+ sunscreen' : 'No protection needed'}
                      </Text>
                    </View>
                    
                    <View style={styles.uvInfo}>
                      <Icon name="sunglasses" size={24} color={colors.textSecondary} />
                      <Text style={styles.uvInfoText}>
                        {uvIndex.value > 5 ? 'Wear sunglasses with UV protection' : 'Sunglasses recommended'}
                      </Text>
                    </View>
                    
                    <View style={styles.uvInfo}>
                      <Icon name="hat-fedora" size={24} color={colors.textSecondary} />
                      <Text style={styles.uvInfoText}>
                        {uvIndex.value > 7 ? 'Wear protective clothing and hat' : 'Hat recommended during peak hours'}
                      </Text>
                    </View>
                    
                    <View style={styles.uvInfo}>
                      <Icon name="umbrella" size={24} color={colors.textSecondary} />
                      <Text style={styles.uvInfoText}>
                        {uvIndex.value > 10 ? 'Seek shade, avoid sun 10am-4pm' : 'Seek shade during peak hours'}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            )}
          </Animated.View>
        </ScrollView>
      )}
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
  scrollContent: {
    padding: 16,
  },
  content: {
    flex: 1,
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
  card: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    marginLeft: 12,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  aqiContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  aqiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  aqiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  aqiLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: colors.textPrimary,
  },
  pollutantsContainer: {
    marginTop: 24,
  },
  pollutant: {
    marginBottom: 16,
  },
  pollutantName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  pollutantValue: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    color: colors.textPrimary,
  },
  uvContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  uvCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uvValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  uvLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: colors.textPrimary,
  },
  uvInfoContainer: {
    marginTop: 24,
  },
  uvInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  uvInfoText: {
    fontSize: 14,
    marginLeft: 12,
    color: colors.textPrimary,
    flex: 1,
  },
});

export default WeatherExtraScreen;