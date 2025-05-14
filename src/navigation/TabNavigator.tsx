import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WeatherScreen from '../screens/WeatherScreen';
import WeatherExtraScreen from '../screens/WeatherExtraScreen';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define the tab parameter list based on the app structure
type TabParamList = {
  Weather: undefined;
  Extras: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Weather"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
      }}
    >
      <Tab.Screen 
        name="Weather" 
        component={WeatherScreen}
        options={{
          headerTitle: 'Weather Forecast',
          tabBarLabel: 'Weather',
          tabBarIcon: ({ color, size }) => (
            <Icon name="weather-partly-cloudy" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Extras" 
        component={WeatherExtraScreen}
        options={{
          headerTitle: 'Weather Details',
          tabBarLabel: 'Details',
          tabBarIcon: ({ color, size }) => (
            <Icon name="weather-windy" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;