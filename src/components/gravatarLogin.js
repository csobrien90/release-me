import React, { useState } from 'react';

const GravatarLogin = ({ userName }) => {
	const [isLogoutExpanded, setIsLogoutExpanded] = useState('');
	
	const toggleMenu = () => {
		if (isLogoutExpanded === '') {
			setIsLogoutExpanded('isExpanded');
		} else {
			setIsLogoutExpanded('');
		}
	}

	const logout = () => {
		localStorage.removeItem("accessToken");
		sessionStorage.removeItem("releases");
		window.location.href = '/';
	}

	return (
		<header id='logout-wrapper'>
			<p id='logout' onClick={() => toggleMenu()}>
				Welcome, {userName}
				<button onClick={() => logout()} className={isLogoutExpanded}>Logout</button>
			</p>
		</header>
	)
}

export default GravatarLogin;