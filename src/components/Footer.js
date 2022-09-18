import React from 'react';

const Footer = () => {
	const now = new Date();
	return (
		<footer>
			&copy; Copyright {now.getFullYear()} - Chad O'Brien
		</footer>
	)
}

export default Footer;