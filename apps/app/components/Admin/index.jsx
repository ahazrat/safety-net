import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList } from 'react-native';
import { Text, List, Switch, HelperText } from 'react-native-paper';
import {
	getUsersArr,
	setUserAdminRole,
	Roles as ROLES,
	withAuthorization,
	AuthUserContext,
} from '@safety-net/shared';
import { HomeButton } from '../Home';

const AdminScreen = ({ navigation }) => {
	const authUser = useContext(AuthUserContext);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pendingUid, setPendingUid] = useState(null);

	const loadUsers = () => {
		setError(null);
		return getUsersArr()
			.then(newUsers => {
				setUsers(newUsers);
				setLoading(false);
			})
			.catch(err => {
				setError(err);
				setLoading(false);
			});
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const onToggleAdmin = (user, grant) => {
		if (!user.uid || user.uid === authUser.uid) return;
		setPendingUid(user.uid);
		setError(null);
		setUserAdminRole(user.uid, grant)
			.then(loadUsers)
			.catch(setError)
			.finally(() => setPendingUid(null));
	};

	return (
		<View style={{ padding: 16, flex: 1 }}>
			<Text variant='headlineMedium'>Admin</Text>
			<Text style={{ marginBottom: 12 }}>The Admin screen is accessible only by signed in admin users.</Text>
			<Text variant='titleMedium'>User List</Text>
			<Text style={{ marginBottom: 12 }}>
				Grant or revoke admin on other accounts. The first admin must be set in the Firebase console.
			</Text>
			{loading && <Text>Loading..</Text>}
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
			<FlatList
				data={users}
				keyExtractor={item => item.uid}
				renderItem={({ item }) => {
					const isAdmin = !!(item.roles && item.roles[ROLES.ADMIN]);
					const isSelf = item.uid === authUser.uid;
					return (
						<List.Item
							title={item.username}
							description={`UID: ${item.uid}\nEmail: ${item.email}${isAdmin ? '\nAdmin' : ''}`}
							right={() => (
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text style={{ marginRight: 8 }}>Admin</Text>
									<Switch
										value={isAdmin}
										disabled={isSelf || pendingUid === item.uid}
										onValueChange={grant => onToggleAdmin(item, grant)}
									/>
								</View>
							)}
						/>
					);
				}}
			/>
		<HomeButton navigation={navigation} />
		</View>
	);
};

const condition = authUser => authUser && authUser.roles && !!authUser.roles[ROLES.ADMIN];

// 'SignIn' only exists in the drawer's route set while signed out (see
// navigation/index.tsx), so redirecting there is a no-op for a signed-in
// non-admin user -- send them to 'Home', which always exists.
export default withAuthorization(condition, props => props.navigation.navigate('Home'))(AdminScreen);
