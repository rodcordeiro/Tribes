import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: 'logs',
          tabBarIcon: ({ color }) => <Feather size={28} name="terminal" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tribes"
        options={{
          title: 'tribes',
          tabBarIcon: ({ color }) => <Feather size={28} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Feather size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
