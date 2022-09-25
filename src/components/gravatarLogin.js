import React, { useState } from 'react';

const GravatarLogin = ({ userName, setIsLoading }) => {
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

	const refresh = () => {
		sessionStorage.removeItem("releases");
		window.location.href = '/';
	}

	return (
		<header id='logout-wrapper'>
			<p id='logout' onClick={() => toggleMenu()}>
				Welcome, {userName}
				<div id='gravatar-button-wrapper' className={isLogoutExpanded}>
					<button onClick={() => logout()}>Logout</button>
					<button onClick={() => refresh()}>Refresh</button>
				</div>
			</p>
		</header>
	)
}

export default GravatarLogin;