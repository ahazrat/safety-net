import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


export default function NotFoundScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'NotFound'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity onPress={() => navigation.replace('Home')} style={styles.link}>
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
