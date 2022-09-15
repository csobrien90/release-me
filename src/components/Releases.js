import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import ReleaseThumbnail from './ReleaseThumbnail';

const Releases = ( {userId, token, callApi, checkReleaseData} ) => {
	const [data, setData] = useState(null);

	useEffect(() => {

		const releaseData = checkReleaseData();
		
		if (releaseData) { 
			setData(releaseData);
			return;
		} else {
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
					sessionStorage.setItem('releases', JSON.stringify(res.Item.releases));
					setData(res.Item.releases);
				});
		}

	}, []);

	return (
		<>
			<h2>Releases</h2>
			{data && Object.keys(data).map(releaseId => {
				return (
					<Link key={releaseId} to={`/release/${releaseId}`}>
						<ReleaseThumbnail data={data[releaseId]} />
					</Link>
				)
			})}
		</>
	)
}

export default Releases;