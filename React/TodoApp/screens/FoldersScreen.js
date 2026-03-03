import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function FoldersScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Folders</Text>

      <Button
        title="Go to Lists"
        onPress={() => navigation.navigate('Lists')} // ✅ matches Stack.Screen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#fff' },
  title: { fontSize: 24, marginBottom: 20 }
});