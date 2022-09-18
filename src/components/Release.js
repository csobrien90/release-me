import React, {useEffect, useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import SignatureRequestThumbnail from './SignatureRequestThumbnail';

const Release = ({ callApi, checkReleaseData, convertTimestamp }) => {
	const { releaseId } = useParams();
	const [data, setData] = useState(null);

	useEffect(() => {

		const releaseData = checkReleaseData();
		
		if (releaseData) { 
			setData(releaseData[releaseId]);
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
					setData(res.Item.releases[releaseId]);
				});
		}

	}, []); // eslint-disable-line react-hooks/exhaustive-deps

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

	const deleteRelease = () => {
		let access = getAccessToken();
		if ( !access ) return;

		const params = {
			"action": "deleteRelease",
			"auth": {
				"userId": access.userId,
				"token": access.token
			},
			"params": {
				"releaseId": releaseId
			}
		}

		callApi(params)
			.then(res => {
				if (res.status !== 200) return;
				sessionStorage.removeItem("releases");
				nav('/');
			});
	}

	const nav = useNavigate();

	return (
		<>
			<header>
				<Link to={'/'} className="back-link">Back to All Releases</Link>
				<h2>{data && data.title}</h2>
				<button className='btn-delete' onClick={deleteRelease}>Delete Release</button>
				<p className='meta-times'>Created: {data && convertTimestamp(data.created)} | Last Modified: {data && convertTimestamp(data.modified)}</p>
			</header>
			<section>
				<h3>Description</h3>
				<p>{data && data.description}</p>
				<h3>Sender info</h3>
				<ul>
					<li>{data && "Name: " + data.senderInfo.name}</li>
					<li>{data && "Email: " + data.senderInfo.emailAddress}</li>
				</ul>
			</section>
			<section>
				<h3>Signature Request(s)</h3>
				<Link to={`/request-signatures/${releaseId}`}><button>Request New Signature(s)</button></Link>

				{
					data && data.requestedSignatures.map((request, index) => {
						return (
							<SignatureRequestThumbnail key={index} data={request} convertTimestamp={convertTimestamp} />
						);
					})
				}
			</section>
		</>
	)
}

export default Release;