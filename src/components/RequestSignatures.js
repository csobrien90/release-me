import React, {useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'

const RequestSignatures = ({ callApi, checkReleaseData }) => {
	const {releaseId} = useParams();
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [signers, setSigners] = useState([{name: '', emailAddress:''}])

	const validateSignerInfo = (signerInfo) => {
		let isObject = typeof signerInfo === 'object';
		let hasTwoProps = Object.keys(signerInfo).length === 2;
		let hasValidEmail = signerInfo.hasOwnProperty('emailAddress') && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(signerInfo.emailAddress);
		let hasValidName = signerInfo.hasOwnProperty('name') && /^[a-zA-Z0-9.' ]{1,}$/.test(signerInfo.name);
		let isValid = isObject && hasTwoProps && hasValidEmail && hasValidName;
		return isValid;
	}

	const addSigner = (event) => {
		event.preventDefault();
		const tempSigners = [...signers];
		tempSigners.push({name: '', emailAddress: ''});
		setSigners(tempSigners);
	}

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
	
	const requestSignature = () => {
		let access = getAccessToken();
		if ( !access ) return;

		const releases = checkReleaseData();
		const tempSigners = [...signers];
		const requestSigners = tempSigners.filter(validateSignerInfo);

		const params = {
			"action": "signatureRequest",
			"auth": {
				"userId": access.userId,
				"token": access.token
			},
			"params": {
				"releaseId": releaseId,
				"senderInfo": releases[releaseId].senderInfo,
				"subject": subject,
				"message": message,
				"signerInfo": requestSigners
			}
		}

		callApi(params)
			.then(res => {
				if (res.status !== 200) return;
				sessionStorage.removeItem("releases");
				// TODO: update release data and use below commented nav to go back to release page
				// nav(`/release/${releaseId}`);
				nav('/');
			});
	}

	const nav = useNavigate();

	return (
		<>
			<Link to={`/release/${releaseId}`} className="back-link">Cancel signature request</Link>
			<h2>Request Signature(s)</h2>
			<form id='request-new-signature'>
				<section>
					<h3>General Info</h3>
					<label htmlFor='subject'>Subject:</label>
					<input type='text' id='subject' name='subject' value={subject} onChange={(e) => setSubject(e.target.value)} required />
					<label htmlFor='message'>Message:</label>
					<textarea id='message' name='message' value={message} onChange={(e) => setMessage(e.target.value)} required />
				</section>
				<section>
					<h3>Signer Info</h3>
					{signers && signers.map((signer, index) => {
						return (
							<div key={index} className="signer-info-row">
								<div className='input-wrapper'>
									<label htmlFor={'signer-name-'+index}>Name:</label>
									<input type='text' id={'signer-name-'+index} name={'signer-name-'+index} value={signer.name} onChange={(e) => {
										const tempSigners = [...signers];
										tempSigners[index].name = e.target.value;
										setSigners(tempSigners);
									}} required />
								</div>
								<div className='input-wrapper'>
									<label htmlFor={'signer-email-'+index}>Email:</label>
									<input type='email' id={'signer-email-'+index} name={'signer-email-'+index} value={signer.emailAddress} onChange={(e) => {
										const tempSigners = [...signers];
										tempSigners[index].emailAddress = e.target.value;
										setSigners(tempSigners);
									}} required />
								</div>
							</div>
						)
					})}
					<button onClick={(e) => addSigner(e)}>Add Signer</button>
				</section>
				<button onClick={(e) => {e.preventDefault(); requestSignature()}}>Make Request</button>
			</form>
		</>
	)
}

export default RequestSignatures;