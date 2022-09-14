import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Release from './components/Release';
import Releases from './components/Releases';

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(null);
	const [token, setToken] = useState(null);

	const checkToken = () => {
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

		// Update state of userId and token
		if (!access.userId) {
			response.message = 'Ineligble access token: missing userId';
			return response;
		}

		if (!access.token) {
			response.message = 'Ineligble access token: missing token';
			return response;
		}
		
		setUserId(access.userId);
		setToken(access.token);
		response.success = true;
		return response;

	}

	const callApi = async (params) => {
		const apiEndpoint = 'https://824oc9yvf6.execute-api.us-east-2.amazonaws.com/prod/releaseme';
		
		const response = await fetch(apiEndpoint, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(params)
		});
		
		return response;
	}

	useEffect(() => {
		const authCall = checkToken();
		setIsLoggedIn(authCall.success);
	}, []);

	return (
		<Router>
			<Routes>
				<Route exact path="/" element={
					isLoggedIn ? 
						<Releases userId={userId} token={token} callApi={callApi} /> : 
						<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setToken={setToken} />
				} />
				<Route path="release/:releaseId" element={
					<Release userId={userId} token={token} checkToken={checkToken} callApi={callApi} />
				} />
			</Routes>
		</Router>
	)
}

export default App;