import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ListsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lists</Text>

      <Button
        title="Go Back to Folders"
        onPress={() => navigation.navigate('Folders')} // ✅ matches Stack.Screen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff' },
  title: { fontSize: 24, marginBottom: 20 }
});