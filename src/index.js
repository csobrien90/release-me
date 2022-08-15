import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
	<React.StrictMode>
		<main>
			<h1 className='sr-only'>Release Me | Media Release Form Manager</h1>
			<App />
		</main>
	</React.StrictMode>,
	document.getElementById('root')
);