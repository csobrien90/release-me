import React, {useState} from 'react';

const Login = ( {setIsLoggedIn, setUserName, setIsLoading} ) => {
	const [userId, setUserId] = useState('');
	const [password, setPassword] = useState('');

	const saveToken = (token, userId, userName) => {
		// Set expiry for three days from now
		const expiry = Date.now() + (1000 * 60 * 60 * 24 * 3);
		window.localStorage.setItem('accessToken', JSON.stringify({userId, expiry, token, userName}))
	}

	const handleLoginAttempt = (e) => {
		e.preventDefault();

		// Get reCaptcha code
		// Call Lambda to validate login information 

		// If successful login, save token and log user in
		let userName = `Chad O'Brien`;
		setUserName(userName);
		saveToken(12345, 1, userName);
		setIsLoggedIn(true);

		// If failed login, alert user of invalid credentials
	}	

	return (
		<div id='login-wrapper'>
			<h2>Login</h2>
			<form onSubmit={(e) => handleLoginAttempt(e)}>
				<label htmlFor='userid'>
					User ID<br />
					<input type='text' id='userid' name='userid' value={userId} onChange={(e) => setUserId(e.target.value)}></input>
				</label>
				<label htmlFor='password'>
					Password<br />
					<input type='password' id='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
				</label>
				<input type='submit' id='login' name='login' value='Login' />
			</form>
		</div>
	)
}

export default Login;