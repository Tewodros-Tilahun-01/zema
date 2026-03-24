import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} />

      {/* Bottom Safe Area */}
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            backgroundColor: '#0f0f0d',
            borderTopColor: 'rgba(255,255,255,0.1)',
            height: insets.bottom > 20 ? 80 : 70,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#14B8A6',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="collection"
          options={{
            title: 'MY Playlist',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="musical-notes" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Downloads',
            tabBarIcon: ({ color, size }) => <Ionicons name="download" size={size} color={color} />,
          }}
        />
      </Tabs>
      <SafeAreaView
        edges={['bottom']}
        style={{ backgroundColor: insets.bottom > 20 ? '#000' : '#0f0f0d' }}
      />
    </View>
  );
}
