import React, {useEffect, useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'

const RequestSignatures = ({ callApi }) => {
	const { releaseId } = useParams();

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

	// const deleteRelease = () => {
	// 	let access = getAccessToken();
	// 	if ( !access ) return;

	// 	const params = {
	// 		"action": "deleteRelease",
	// 		"auth": {
	// 			"userId": access.userId,
	// 			"token": access.token
	// 		},
	// 		"params": {
	// 			"releaseId": releaseId
	// 		}
	// 	}

	// 	callApi(params)
	// 		.then(res => {
	// 			if (res.status !== 200) return;
	// 			sessionStorage.removeItem("releases");
	// 			nav('/');
	// 		});
	// }

	// const nav = useNavigate();

	return (
		<>
			<Link to={`/release/${releaseId}`}>Cancel signature request</Link>
			<h2>Request New Signature(s)</h2>
		</>
	)
}

export default RequestSignatures;