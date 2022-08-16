import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Releases from './components/Releases';

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	
	const authenticateToken = () => {
		const response = {success: false};

		// Get access token from local storage and parse to JSON
		let access = window.localStorage.getItem('accessToken');
		if (access === null) {
			response.message = 'No access token found in local storage';
			return response;
		} else {
			try {
				access = JSON.parse(access);
			} catch {
				response.message = 'Ineligble access token: improper format';
				return response;
			}
		}

		// Check expiry of access token
		if (!access.expiry) {
			response.message = 'Ineligble access token: missing expiry';
			return response;
		} else if (access.expiry < Date.now()) {
			response.success = false;
			response.message = 'Ineligble access token: expired';
			return response;
		}

		// Send access token to serverless function for authentication
		let servelessRes = true;
		if (servelessRes) {
			response.success = true;
			response.message = 'Successfully authenticated!';
			return response;
		} else {
			response.message = 'Authentication failed!';
			return response;
		}
	}

	useEffect(() => {
		const authCall = authenticateToken();
		console.log(authCall.message);
		setIsLoggedIn(authCall.success);
	}, []);

	if (!isLoggedIn) {
		return <Login setIsLoggedIn={setIsLoggedIn} />;
	} else {
		return <Releases isLoggedIn={isLoggedIn} />
	}
}

export default App;