import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import ReleaseThumbnail from './ReleaseThumbnail';

const Releases = ( {userId, token, callApi} ) => {
	const [data, setData] = useState(null);

	useEffect(() => {

		const params = {
			"action": "getAllReleases",
			"auth": {
				"userId": userId,
				"token": token
			}
		}

		callApi(params)
			.then(res => res.json())
			.then(res => {
				console.log(res);
				setData(res.Item.releases);
				console.log(data);
			});

	}, []);

	return (
		<>
			<h2>Releases</h2>
			{data && Object.keys(data).forEach((releaseId) => {
				return (
					<Link key={releaseId} to={'/release/'+releaseId}>
						<ReleaseThumbnail data={data.releaseId} />
					</Link>
				)
			})}
		</>
	)
}

export default Releases;