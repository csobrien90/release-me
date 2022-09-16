import React from 'react';

const GravatarLogin = ({ userName }) => {

	const logout = () => {
		localStorage.removeItem("accessToken");
		sessionStorage.removeItem("releases");
		window.location.href = '/';
	}

	return (
		<p>
			Welcome, {userName}
			<button onClick={() => logout()}>Logout</button>
		</p>
	)
}

export default GravatarLogin;