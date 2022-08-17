import React from 'react';
import { Link } from 'react-router-dom';
import ReleaseThumbnail from './ReleaseThumbnail';

const Releases = ( {userId} ) => {

	// This component fetches releases by userId

	const data = [{
		"id": 12345,
		"title": "Release 1",
		"description" : "This is a description of this media release. It will say things that describe this release."
	}]

	return (
		<>
			<h2>Releases</h2>
			{data && data.map((releaseData, index) => {
				return (
					<Link key={index} to={'/release/'+releaseData.id}>
						<ReleaseThumbnail data={releaseData} />
					</Link>
				)
			})}
		</>
	)
}

export default Releases;