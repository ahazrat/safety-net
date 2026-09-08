import React from 'react';
import { View, Button } from 'react-native';
import { doSignOut } from '@safety-net/shared';
import { styles } from '../Themed';

const SignOutButton = () => (
    <View style={styles.button}>
        <Button
            title='SignOut'
            onPress={() => doSignOut()}
        />
    </View>
);

export default SignOutButton;
