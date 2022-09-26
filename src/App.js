import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import GravatarLogin from './components/GravatarLogin';
import Release from './components/Release';
import Releases from './components/Releases';
import CreateRelease from './components/CreateRelease';
import RequestSignatures from './components/RequestSignatures';
import Footer from './components/Footer';
import Loading from './components/Loading';

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(null);
	const [token, setToken] = useState(null);
	const [userName, setUserName] = useState('');
	const [isLoading, setIsLoading] = useState(false);

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

		if (!access.userName) {
			response.message = 'Ineligble access userName: missing userName';
			return response;
		}
		
		setUserId(access.userId);
		setToken(access.token);
		setUserName(access.userName);

		response.success = true;
		return response;

	}

	const checkReleaseData = () => {
		// Get saved data from sessionStorage
		let sessionData = sessionStorage.getItem('releases');
		let parsedData = null;

		try {
			parsedData = JSON.parse(sessionData);
		} catch (error) {
			console.error(error);
		}

		// Validate data

		return parsedData;
	}

	const sortSignatures = (data) => {
		const signatures = {
			pending: [],
			signed: []
		};
	
		data.forEach(requested => {
			requested.signatures.forEach(sig => {
				// Add request metadata to individual signatures
				sig.createdAt = requested.createdAt;
				sig.subject = requested.subject;
				sig.message = requested.message;
				sig.id = requested.signatureRequestId;

				// Sort by signing status
				switch(sig.statusCode) {
					case "awaiting_signature":
						signatures.pending.push(sig);
						break;
					case "signed":
						signatures.signed.push(sig);
						break;
					default:
						return;
				}
			})
		})

		return signatures;
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

	const convertTimestamp = (timestamp) => {
		const date = new Date(timestamp);
		const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
		return date.toLocaleString(undefined, options);
	}

	useEffect(() => {
		const authCall = checkToken();
		setIsLoggedIn(authCall.success);
	}, []);

	return (
		<>
			{isLoggedIn && <GravatarLogin userName={userName} setIsLoading={setIsLoading} />}
			<Loading isVisible={isLoading} />
			<Router>
				<Routes>
					<Route exact path="/" element={
						isLoggedIn ? 
							<Releases userId={userId} token={token} callApi={callApi} checkReleaseData={checkReleaseData} convertTimestamp={convertTimestamp} setIsLoading={setIsLoading} sortSignatures={sortSignatures} /> : 
							<Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setToken={setToken} setUserName={setUserName} setIsLoading={setIsLoading} />
					} />
					<Route path="release/:releaseId" element={
						<Release callApi={callApi} checkReleaseData={checkReleaseData} convertTimestamp={convertTimestamp} setIsLoading={setIsLoading}  sortSignatures={sortSignatures} />
					} />
					<Route path="create" element={
						<CreateRelease callApi={callApi} setIsLoading={setIsLoading} />
					} />
					<Route path="request-signatures/:releaseId" element={
						<RequestSignatures callApi={callApi} checkReleaseData={checkReleaseData} setIsLoading={setIsLoading} />
					} />
				</Routes>
			</Router>
			<Footer />
		</>
	)
}

export default App;