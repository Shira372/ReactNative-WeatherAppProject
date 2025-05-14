// components/WeatherCard.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { WeatherData } from '../../types/types';
import { getWeatherIconName, formatTemperature } from '../utils/helpers';

interface WeatherCardProps {
  weather: WeatherData;
  onPress?: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.leftContent}>
            <Title style={styles.cityName}>{weather.name}</Title>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
            <View style={styles.tempContainer}>
              <Text style={styles.temperature}>{Math.round(weather.main.temp)}°</Text>
              <Text style={styles.weatherCondition}>{weather.weather[0].main}</Text>
            </View>
            <Text style={styles.minMaxTemp}>
              H:{Math.round(weather.main.temp_max)}° L:{Math.round(weather.main.temp_min)}°
            </Text>
          </View>

          <View style={styles.rightContent}>
            <Icon
              name={getWeatherIconName(weather.weather[0].main)}
              size={80}
              color={colors.primary}
            />
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Icon name="water-percent" size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{weather.main.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="weather-windy" size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{weather.wind.speed} m/s</Text>
              </View>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Text style={styles.viewDetails}>View Detailed Forecast</Text>
          <Icon name="chevron-right" size={20} color={colors.primary} />
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  leftContent: {
    flex: 3,
  },
  rightContent: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  weatherCondition: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  minMaxTemp: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailsContainer: {
    width: '100%',
    marginTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'flex-end',
  },
  viewDetails: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default WeatherCard;