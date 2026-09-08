import * as React from 'react';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList } from '../../types';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function NotFoundScreen({
  navigation,
}: DrawerScreenProps<RootStackParamList, 'NotFound'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text variant='titleLarge'>This screen doesn't exist.</Text>
      <Button mode='text' onPress={() => navigation.replace('Home')} style={{ marginTop: 15 }}>
        Go to home screen!
      </Button>
    </View>
  );
}
