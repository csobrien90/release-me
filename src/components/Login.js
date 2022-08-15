import React, {useState} from 'react';

const Login = ( {setIsLoggedIn} ) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginAttempt = (e) => {
		e.preventDefault();
		console.log(e);

		// setIsLoggedIn(newLoginStatus)
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