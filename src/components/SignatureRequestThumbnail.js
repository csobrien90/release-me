import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'

const SignatureRequestThumbnail = ( {data, convertTimestamp, callApi, setIsLoading} ) => {
	const [isConfirmed, setisConfirmed] = useState(false);
	
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
	
	const deleteSignature = () => {

		if (!isConfirmed) {
			setisConfirmed(true);
			return;
		}

		setIsLoading(true);

		let access = getAccessToken();
		if ( !access ) return;

		const params = {
			"action": "deleteRequest",
			"auth": {
				"userId": access.userId,
				"token": access.token
			},
			"params": {
				"requestId": data.id
			}
		}

		callApi(params)
			.then(res => {
				setIsLoading(false);
				if (res.status !== 200) return;
				sessionStorage.removeItem("releases");
				document.querySelector('#release-notification').style.display = 'grid';
				document.querySelector('#release-notification').innerText = 'Request deleted successfully!'
				setTimeout(() => {
					nav('/');
				}, 2000);
			})
			.catch(error => {
				setIsLoading(false);
				document.querySelector('#release-notification').style.display = 'grid';
				document.querySelector('#release-notification').innerText = 'Unable to delete request. Error: ' + error.message;
				setTimeout(() => {
					document.querySelector('#release-notification').style.display = 'none';
				}, 2000);
			})
	}

	const resendRequest = () => {

		setIsLoading(true);

		let access = getAccessToken();
		if ( !access ) return;

		const params = {
			"action": 'sendReminder',
			"auth": {
				"userId": access.userId,
				"token": access.token
			},
			"params": {
				"requestId": data.id,
				"emailAddress": data.signerEmailAddress
			}
		}

		callApi(params)
			.then(res => {
				setIsLoading(false);
				if (res.status !== 200) return;
				sessionStorage.removeItem("releases");
				document.querySelector('#release-notification').style.display = 'grid';
				document.querySelector('#release-notification').innerText = 'Reminder sent!'
				setTimeout(() => {
					document.querySelector('#release-notification').style.display = 'none';
				}, 2000);
			})
			.catch(error => {
				setIsLoading(false);
				document.querySelector('#release-notification').style.display = 'grid';
				document.querySelector('#release-notification').innerText = 'Unable to send reminder. Error: ' + error.message;
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
		<article>
			<header>
				<h4>{data.signerName} - {data.signerEmailAddress}</h4>
				<p className='metadata'>Requested: {convertTimestamp(data.createdAt * 1000)}</p>
				{data.signedAt && <p className='metadata'>Signed: {convertTimestamp(data.signedAt * 1000)}</p>}
			</header>
			<ul>
				<li>Subject: {data && data.subject}</li>
				<li>Message: {data && data.message}</li>
			</ul>
			{
				!data.signedAt && 
				<div className='signature-button-wrapper'>
					<button onClick={resendRequest}>Resend request</button>
					<button onClick={deleteSignature} className='btn-delete' style={isConfirmed ? {backgroundColor: 'salmon'} : {backgroundColor: 'var(--dk-green)'}}>{isConfirmed ? 'Are you sure?' : 'Delete Request'}</button>
				</div>
			}
		</article>
	)
}

export default SignatureRequestThumbnail;