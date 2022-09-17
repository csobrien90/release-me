import React, {useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'

const RequestSignatures = ({ callApi }) => {
	const {releaseId} = useParams();
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');

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

		const params = {
			"action": "signatureRequest",
			"auth": {
				"userId": access.userId,
				"token": access.token
			},
			"params": {
				"releaseId": releaseId,
				"senderInfo": {
					"name": "Company ABC",
					"emailAddress": "company@abc.com"
				},
				"subject": subject,
				"message": message,
				"signerInfo": [{
					"name": "Chad O'Brien",
					"emailAddress": "obrien.music@gmail.com"
				}]
			}
		}

		callApi(params)
			.then(res => {
				if (res.status !== 200) return;
				sessionStorage.removeItem("releases");
				nav(`/release/${releaseId}`);
			});
	}

	const nav = useNavigate();

	return (
		<>
			<Link to={`/release/${releaseId}`}>Cancel signature request</Link>
			<h2>Request New Signature(s)</h2>
			<form>
				<section>
					<h3>General Info</h3>
					<label htmlFor='subject'>Subject:</label>
					<input type='text' id='subject' name='subject' value={subject} onChange={(e) => setSubject(e.target.value)} required />
					<label htmlFor='message'>Message:</label>
					<textarea id='message' name='message' value={message} onChange={(e) => setMessage(e.target.value)} required />
				</section>
				<section>
					<h3>Signer Info</h3>
					{/* <label htmlFor='sender-name'>Name:</label>
					<input type='text' id='sender-name' name='sender-name' value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
					<label htmlFor='sender-email'>Email:</label>
					<input type='email' id='sender-email' name='sender-email' value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} required /> */}
				</section>
				<button onClick={(e) => {e.preventDefault(); requestSignature()}}>Create Release</button>
			</form>
		</>
	)
}

export default RequestSignatures;