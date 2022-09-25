import React, {useEffect, useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import SignatureRequestThumbnail from './SignatureRequestThumbnail';

const Release = ({ callApi, checkReleaseData, convertTimestamp, setIsLoading }) => {
	const { releaseId } = useParams();
	const [data, setData] = useState(null);
	const [signatures, setSignatures] = useState(null);

	const sortSignatures = (data) => {
		const signatures = {
			pending: [],
			signed: []
		};
	
		data.forEach(requested => {
			requested.signatures.forEach(sig => {
				// Add request metadata to individual signatures
				sig.createdAt = requested.createdAt;
				sig.subject = requested.subject;
				sig.message = requested.message;

				// Sort by signing status
				switch(sig.statusCode) {
					case "awaiting_signature":
						signatures.pending.push(sig);
						break;
					case "signed":
						signatures.signed.push(sig);
						break;
					default:
						return;
				}
			})
		})

		return signatures;
	}

	useEffect(() => {

		const releaseData = checkReleaseData();
		
		if (releaseData) { 
			setData(releaseData[releaseId]);
			let signatures = sortSignatures(releaseData[releaseId].requestedSignatures);
			setSignatures(signatures);
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
					let signatures = sortSignatures(res.Item.releases[releaseId].requestedSignatures);
					setSignatures(signatures);
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
			<header id='release-header'>
				<Link to={'/'} className="back-link">Back to All Releases</Link>
				<h2>{data && data.title}</h2>
				<button className='btn-delete' onClick={deleteRelease}>Delete Release</button>
				<p className='metadata'>Created: {data && convertTimestamp(data.created)} <br></br>Last Modified: {data && convertTimestamp(data.modified)}</p>
			</header>
			<section id='release-general-info'>
				<h3>Description</h3>
				<p>{data && data.description}</p>
				<h3>Sender info</h3>
				<ul>
					<li>{data && "Name: " + data.senderInfo.name}</li>
					<li>{data && "Email: " + data.senderInfo.emailAddress}</li>
				</ul>
			</section>
			<section id='release-signatures'>
				<h3>Signatures</h3>
				<Link to={`/request-signatures/${releaseId}`}><button>Request New Signature(s)</button></Link>
				<dl>
					{signatures && signatures.pending.length > 0 && <dt>Pending ({signatures && signatures.pending.length})</dt>}
					{signatures && signatures.pending.length > 0 && signatures.pending.map((sig, index) => {
						return (
							<SignatureRequestThumbnail key={index} data={sig} convertTimestamp={convertTimestamp} />
						)
					})}
					{signatures && signatures.signed.length > 0 && <dt>Signed ({signatures && signatures.signed.length})</dt>}
					{signatures && signatures.signed.length > 0 && signatures.signed.map((sig, index) => {
						return (
							<SignatureRequestThumbnail key={index} data={sig} convertTimestamp={convertTimestamp} />
						)
					})}
				</dl>
				{(!signatures || (signatures.pending.length === 0 && signatures.signed.length === 0)) ? <p id='no-signatures'>No signatures requested yet.</p> : ''}
			</section>
		</>
	)
}

export default Release;