import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from '../Themed';
import { getUsersArr, Roles as ROLES } from '@safety-net/shared';
import { withAuthorization } from '../../auth/session';
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
		<View>
			<Text style={styles.title}>Admin</Text>
			<Text style={styles.textCenter}>The Admin screen is accessible only by signed in admin users.</Text>
			<Text style={styles.textCenter}>User List</Text>
			{loading && <Text style={styles.textCenter}>Loading..</Text>}
			<FlatList
				data={users}
				renderItem={({ item }) => (
					<View style={styles.itemView}>
						<Text style={styles.textBold}>UID</Text>
						<Text style={styles.text}>{item.uid}</Text>
						<Text style={styles.textBold}>Email</Text>
						<Text style={styles.text}>{item.email}</Text>
						<Text style={styles.textBold}>Username</Text>
						<Text style={styles.text}>{item.username}</Text>
					</View>
				)}
			/>
		<HomeButton navigation={navigation} />
		</View>
	);
};

const condition = authUser => authUser && authUser.roles && !!authUser.roles[ROLES.ADMIN];

export default withAuthorization(condition, props => props.navigation.navigate('SignIn'))(AdminScreen);
