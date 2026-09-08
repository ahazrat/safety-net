import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Text, List } from 'react-native-paper';
import { getUsersArr, Roles as ROLES, withAuthorization } from '@safety-net/shared';
import { HomeButton } from '../Home';

const AdminScreen = ({ navigation }) => {

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUsersArr().then(newUsers => {
			setUsers(newUsers);
			setLoading(false);
		});
	}, []);

	return (
		<View style={{ padding: 16, flex: 1 }}>
			<Text variant='headlineMedium'>Admin</Text>
			<Text style={{ marginBottom: 12 }}>The Admin screen is accessible only by signed in admin users.</Text>
			<Text variant='titleMedium'>User List</Text>
			{loading && <Text>Loading..</Text>}
			<FlatList
				data={users}
				keyExtractor={item => item.uid}
				renderItem={({ item }) => (
					<List.Item
						title={item.username}
						description={`UID: ${item.uid}\nEmail: ${item.email}`}
					/>
				)}
			/>
		<HomeButton navigation={navigation} />
		</View>
	);
};

const condition = authUser => authUser && authUser.roles && !!authUser.roles[ROLES.ADMIN];

export default withAuthorization(condition, props => props.navigation.navigate('SignIn'))(AdminScreen);
