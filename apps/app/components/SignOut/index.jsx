import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { doSignOut } from '@safety-net/shared';

const SignOutButton = () => (
    <View style={{ marginVertical: 8 }}>
        <Button mode='outlined' onPress={() => doSignOut()}>
            Sign Out
        </Button>
    </View>
);

export default SignOutButton;
