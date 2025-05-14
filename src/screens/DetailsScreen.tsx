// screens/DetailsScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getWeatherIconName, formatTime } from '../utils/helpers';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type Props = {
  route: DetailsScreenRouteProp;
};

const DetailsScreen: React.FC<Props> = ({ route }) => {
  const { weather } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY }] }]}>
          <Card style={styles.card}>
            <Card.Cover 
              source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` }} 
              style={styles.weatherIcon}
            />
            <Card.Content>
              <Title style={styles.title}>{weather.name}</Title>
              <Paragraph style={styles.temperature}>{Math.round(weather.main.temp)}°C</Paragraph>
              <Paragraph style={styles.description}>{weather.weather[0].description}</Paragraph>
              
              <Divider style={styles.divider} />
              
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Icon name="thermometer" size={24} color={colors.primary} />
                  <Text style={styles.detailLabel}>Feels Like</Text>
                  <Text style={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="water-percent" size={24} color={colors.primary} />
                  <Text style={styles.detailLabel}>Humidity</Text>
                  <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
                </View>
              </View>
              
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Icon name="speedometer" size={24} color={colors.primary} />
                  <Text style={styles.detailLabel}>Pressure</Text>
                  <Text style={styles.detailValue}>{weather.main.pressure} hPa</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="weather-windy" size={24} color={colors.primary} />
                  <Text style={styles.detailLabel}>Wind Speed</Text>
                  <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
                </View>
              </View>
              
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Icon name="weather-sunset-up" size={24} color={colors.primary} />
                  <Text style={styles.detailLabel}>Sunrise</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(weather.sys.sunrise)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="weather-sunset-down" size={24} color={colors.primary} />
                  <Text style={styles.detailLabel}>Sunset</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(weather.sys.sunset)}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 16,
  },
  weatherIcon: {
    height: 180,
    backgroundColor: colors.lightBackground,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    color: colors.textPrimary,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginVertical: 8,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
});

export default DetailsScreen;