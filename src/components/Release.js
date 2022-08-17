import React from 'react';
import { useParams } from 'react-router-dom'

const Release = () => {
	const { releaseId } = useParams();

	// This component fetches full release data by releaseId

	return (
		<>
			<h2>Release # {releaseId}</h2>
		</>
	)
}

export default Release;