import React, {useState} from 'react';

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

		// const params = {
		// 	"action": "deleteRelease",
		// 	"auth": {
		// 		"userId": access.userId,
		// 		"token": access.token
		// 	},
		// 	"params": {
		// 		"releaseId": releaseId
		// 	}
		// }

		// callApi(params)
		// 	.then(res => {
		// 		setIsLoading(false);
		// 		if (res.status !== 200) return;
		// 		sessionStorage.removeItem("releases");
		// 		document.querySelector('#release-notification').style.display = 'grid';
		// 		document.querySelector('#release-notification').innerText = 'Release deleted successfully!'
		// 		setTimeout(() => {
		// 			nav('/');
		// 		}, 2000);
		// 	})
		// 	.catch(error => {
		// 		setIsLoading(false);
		// 		document.querySelector('#release-notification').style.display = 'grid';
		// 		document.querySelector('#release-notification').innerText = 'Unable to delete release. Error: ' + error.message;
		// 		setTimeout(() => {
		// 			document.querySelector('#release-notification').style.display = 'none';
		// 		}, 2000);
		// 	})
	}

	const resendRequest = () => {

		setIsLoading(true);

		let access = getAccessToken();
		if ( !access ) return;

		console.log('resend!!');

		// const params = {
		// 	"action": "deleteRelease",
		// 	"auth": {
		// 		"userId": access.userId,
		// 		"token": access.token
		// 	},
		// 	"params": {
		// 		"releaseId": releaseId
		// 	}
		// }

		// callApi(params)
		// 	.then(res => {
		// 		setIsLoading(false);
		// 		if (res.status !== 200) return;
		// 		sessionStorage.removeItem("releases");
		// 		document.querySelector('#release-notification').style.display = 'grid';
		// 		document.querySelector('#release-notification').innerText = 'Release deleted successfully!'
		// 		setTimeout(() => {
		// 			nav('/');
		// 		}, 2000);
		// 	})
		// 	.catch(error => {
		// 		setIsLoading(false);
		// 		document.querySelector('#release-notification').style.display = 'grid';
		// 		document.querySelector('#release-notification').innerText = 'Unable to delete release. Error: ' + error.message;
		// 		setTimeout(() => {
		// 			document.querySelector('#release-notification').style.display = 'none';
		// 		}, 2000);
		// 	})
	}

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