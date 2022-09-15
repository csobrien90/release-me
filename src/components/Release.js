import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom'

const Release = ({ callApi, checkReleaseData }) => {
	const { releaseId } = useParams();
	const [data, setData] = useState(null);

	useEffect(() => {

		const releaseData = checkReleaseData();
		
		if (releaseData) { 
			setData(releaseData[releaseId]);
			return;
		} else {

			// Get access token from local storage and parse to JSON
			let response = {success: false};
			let access = window.localStorage.getItem('accessToken');

			if (access === null) {
				response.message = 'No access token found in local storage';
				console.log(response);
			} else {
				try {
					access = JSON.parse(access);
				} catch {
					response.message = 'Ineligble access token: improper format';
					console.log(response);
				}
			}

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
					setData(res.Item.releases[releaseId]);
				});
		}

	}, []);


	// This component fetches full release data by releaseId


	return (
		<>
			<h2>{data && data.title}</h2>
			<p>{data && data.description}</p>
		</>
	)
}

export default Release;