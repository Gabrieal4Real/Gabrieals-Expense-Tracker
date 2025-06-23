import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabs = [
  {
    name: 'statistics',
    title: 'Statistics',
    icon: { active: 'stats-chart', inactive: 'stats-chart-outline' },
  },
  {
    name: 'index',
    title: 'Home',
    icon: { active: 'planet', inactive: 'planet-outline' },
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: { active: 'aperture', inactive: 'aperture-outline' },
  },
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.placeholder,
        tabBarStyle: {
          backgroundColor: Colors.navigationBar,
          borderTopWidth: 1,
          borderColor: Colors.borderStroke,
          paddingTop: 4,
          height: 56 + insets.bottom,
        },
      }}
    >
      {tabs.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? icon.active : icon.inactive as any}
                size={focused ? size + 2 : size - 2}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}