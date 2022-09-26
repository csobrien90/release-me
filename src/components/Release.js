import React, {useEffect, useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import SignatureRequestThumbnail from './SignatureRequestThumbnail';

const Release = ({ callApi, checkReleaseData, convertTimestamp, setIsLoading, sortSignatures }) => {
	const { releaseId } = useParams();
	const [data, setData] = useState(null);
	const [signatures, setSignatures] = useState(null);
	const [isConfirmed, setisConfirmed] = useState(false);

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

		if (!isConfirmed) {
			setisConfirmed(true);
			return;
		}

		if (signatures.signed.length > 0) {
			document.querySelector('#release-notification').style.display = 'grid';
			document.querySelector('#release-notification').innerText = 'Cannot delete releases with completed signatures. If you wish to delete pending signatures, you may do so one by one.';
			setisConfirmed(false);
			setTimeout(() => {
				document.querySelector('#release-notification').style.display = 'none';
			}, 4000);
			return;
		}

		setIsLoading(true);

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
				setIsLoading(false);
				if (res.status !== 200) return;
				sessionStorage.removeItem("releases");
				document.querySelector('#release-notification').style.display = 'grid';
				document.querySelector('#release-notification').innerText = 'Release deleted successfully!'
				setTimeout(() => {
					nav('/');
				}, 2000);
			})
			.catch(error => {
				setIsLoading(false);
				document.querySelector('#release-notification').style.display = 'grid';
				document.querySelector('#release-notification').innerText = 'Unable to delete release. Error: ' + error.message;
				setTimeout(() => {
					document.querySelector('#release-notification').style.display = 'none';
				}, 2000);
			})
	}

	const nav = useNavigate();

	window.addEventListener('click', (e) => {
		if (e.target.className !== 'btn-delete') {
			setisConfirmed(false);
		};
	});

	return (
		<>
			<header id='release-header'>
				<Link to={'/'} className="back-link">Back to All Releases</Link>
				<h2>{data && data.title}</h2>
				<button className='btn-delete' onClick={deleteRelease} style={isConfirmed ? {backgroundColor: 'salmon'} : {backgroundColor: 'var(--dk-green)'}}>{isConfirmed ? 'Are you sure?' : 'Delete Release'}</button>
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
							<SignatureRequestThumbnail key={index} data={sig} convertTimestamp={convertTimestamp} callApi={callApi} setIsLoading={setIsLoading} />
						)
					})}
					{signatures && signatures.signed.length > 0 && <dt>Signed ({signatures && signatures.signed.length})</dt>}
					{signatures && signatures.signed.length > 0 && signatures.signed.map((sig, index) => {
						return (
							<SignatureRequestThumbnail key={index} data={sig} convertTimestamp={convertTimestamp} callApi={callApi} setIsLoading={setIsLoading} />
						)
					})}
				</dl>
				{(!signatures || (signatures.pending.length === 0 && signatures.signed.length === 0)) ? <p id='no-signatures'>No signatures requested yet.</p> : ''}
			</section>
			<dialog id='release-notification'></dialog>
		</>
	)
}

export default Release;