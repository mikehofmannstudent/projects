import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FoldersScreen from './screens/FoldersScreen';
import ListsScreen from './screens/ListsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true // ✅ boolean, not string
        }}
      >
        <Stack.Screen name="Folders" component={FoldersScreen} />
        <Stack.Screen name="Lists" component={ListsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}