import React, { useState } from 'react';
import Login from './components/Login';
import Releases from './components/Releases';

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	
	if (!isLoggedIn) {
		return <Login setIsLoggedIn={setIsLoggedIn} />;
	} else {
		return <Releases />		
	}
}

export default App;