import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../contexts/ThemeContext';
import { AppDetailScreen } from '../screens/AppDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { TimelineScreen } from '../screens/TimelineScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TimelineStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Timeline" 
      component={TimelineScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen 
      name="AppDetail" 
      component={AppDetailScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Search" 
      component={SearchScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen 
      name="AppDetail" 
      component={AppDetailScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export const AppNavigator: React.FC = () => {
  const {theme, isDark} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'TimelineTab':
              iconName = 'timeline';
              break;
            case 'SearchTab':
              iconName = 'search';
              break;
            case 'ProfileTab':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen 
        name="TimelineTab" 
        component={TimelineStack}
        options={{title: 'Timeline'}}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchStack}
        options={{title: 'Search'}}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
};
