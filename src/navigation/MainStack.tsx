import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import DetailsScreen from '../screens/DetailsScreen';
import { RootStackParamList } from '../../types/types';
import { colors } from '../theme/colors';

const Stack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Weather Details',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;