import React from 'react';

const Loading = ( {isVisible} ) => {
	const visibility = isVisible ? {display: 'grid'} : {display: 'none'};

	return (
		<dialog id="loading-modal" style={visibility}>
			<p>Loading...</p>
		</dialog>
	)
}

export default Loading;