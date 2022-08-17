import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Release from './components/Release';
import Releases from './components/Releases';

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(null);
	
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
			setUserId(123);
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

	return (
		<Router>
			<Routes>
				<Route exact path="/" element={isLoggedIn ? <Releases userId={userId} /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
				<Route path="release/:releaseId" element={<Release authenticateToken={authenticateToken} />} />
			</Routes>
		</Router>
	)
}

export default App;