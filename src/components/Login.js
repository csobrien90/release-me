import React, {useState} from 'react';

const Login = ( {setIsLoggedIn} ) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const saveToken = (token) => {
		// Set expiry for three days from now
		const expiry = Date.now() + (1000 * 60 * 60 * 24 * 3);
		window.localStorage.setItem('accessToken', JSON.stringify({expiry, token}))
	}

	const handleLoginAttempt = (e) => {
		e.preventDefault();
		console.log(e);

		saveToken('test');
		setIsLoggedIn(true);
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