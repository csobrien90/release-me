import React, {useState} from 'react';

const Login = ( {setIsLoggedIn} ) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const saveToken = (token, userId) => {
		// Set expiry for three days from now
		const expiry = Date.now() + (1000 * 60 * 60 * 24 * 3);
		window.localStorage.setItem('accessToken', JSON.stringify({userId, expiry, token}))
	}

	const handleLoginAttempt = (e) => {
		e.preventDefault();

		// Get reCaptcha code
		// Call Lambda to validate login information 

		// If successful login, save token and log user in
		saveToken(12345, 1);
		setIsLoggedIn(true);

		// If failed login, alert user of invalid credentials
	}	

	return (
		<>
			<h2>Login</h2>
			<form onSubmit={(e) => handleLoginAttempt(e)}>
				<label htmlFor='username'>
					Username<br />
					<input type='text' id='username' name='username' value={username} onChange={(e) => setUsername(e.target.value)}></input>
				</label>
				<label htmlFor='password'>
					Password<br />
					<input type='password' id='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
				</label>
				<input type='submit' id='login' name='login' value='Login' />
			</form>
		</>
	)
}

export default Login;