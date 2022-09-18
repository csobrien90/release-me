import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import ReleaseThumbnail from './ReleaseThumbnail';

const Releases = ( {userId, token, callApi, checkReleaseData} ) => {
	const [data, setData] = useState(null);

	const getAccessToken = () => {
		// Get access token from local storage and parse to JSON
		let access = window.localStorage.getItem('accessToken');

		try {
			access = JSON.parse(access);
		} catch {
			access = false;
		}

		return access;
	}
	
	useEffect(() => {

		const releaseData = checkReleaseData();
		
		if (releaseData) { 
			setData(releaseData);
			return;
		} else {
			let access = getAccessToken();
			if ( !access ) return;

			const params = {
				"action": "getAllReleases",
				"auth": {
					"userId": access.userId,
					"token": access.token
				}
			}
	
			callApi(params)
				.then(res => res.json())
				.then(res => {
					sessionStorage.setItem('releases', JSON.stringify(res.Item.releases));
					setData(res.Item.releases);
				});
		}

	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<header id='all-releases'>
				<h2>All Releases</h2>
				<Link to={'/create'}><button>Create New Release</button></Link>
			</header>
			<section id='release-thumbnails'>
				{data && Object.keys(data).map(releaseId => {
					return (
						<Link key={releaseId} to={`/release/${releaseId}`}>
							<ReleaseThumbnail data={data[releaseId]} />
						</Link>
					)
				})}
			</section>
		</>
	)
}

export default Releases;