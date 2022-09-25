import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

const CreateRelease = ({ callApi, setIsLoading }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [senderName, setSenderName] = useState('');
	const [senderEmail, setSenderEmail] = useState('');

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

	const createRelease = () => {
		setIsLoading(true);

		let access = getAccessToken();
		if ( !access ) return;

		const params = {
			"action": "saveRelease",
			"auth": {
				"userId": access.userId,
				"token": access.token
			},
			"params": {
				"title": title,
				"description": description,
				"senderInfo": {
					"name": senderName,
					"emailAddress": senderEmail
				}
			}
		}

		callApi(params)
			.then(res => {
				if (res.status !== 200) return;
				sessionStorage.removeItem("releases");
				document.querySelector('#release-notification').style.display = 'grid';
				document.querySelector('#release-notification').innerText = 'Release created successfully!'
				setTimeout(() => {
					nav('/');
				}, 2000);
			})
			.catch(error => {
				document.querySelector('#release-notification').style.display = 'grid';
				document.querySelector('#release-notification').innerText = 'Unable to create release. Error: ' + error.message;
				setTimeout(() => {
					document.querySelector('#release-notification').style.display = 'none';
				}, 2000);
			})
			
	}

	const nav = useNavigate();

	return (
		<>
			<Link to={'/'} className="back-link">Back to All Releases</Link>
			<h2>Create a Release</h2>
			<form id='create-release'>
				<section>
					<h3>Release Info</h3>
					<label htmlFor='title'>Title</label>
					<input type='text' id='title' name='title' value={title} onChange={(e) => setTitle(e.target.value)} required />
					<label htmlFor='description'>Description</label>
					<textarea id='description' name='description' value={description} onChange={(e) => setDescription(e.target.value)} required />
				</section>
				<section>
					<h3>Sender Info</h3>
					<p>
						This info will be used to identify you in:
					</p>
					<ul>
						<li>signature request emails</li>
						<li>media release contract</li>
					</ul>
					<label htmlFor='sender-name'>Name</label>
					<input type='text' id='sender-name' name='sender-name' value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
					<label htmlFor='sender-email'>Email</label>
					<input type='email' id='sender-email' name='sender-email' value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} required />
				</section>
				<button onClick={(e) => {e.preventDefault(); createRelease()}}>Create Release</button>
			</form>
			<dialog id='release-notification'>Release created successfully!</dialog>
		</>
	)
}

export default CreateRelease;