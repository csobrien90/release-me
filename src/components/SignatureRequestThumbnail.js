import React from 'react';

const SignatureRequestThumbnail = ( {data, convertTimestamp} ) => {
	console.log(data)
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
		</article>
	)
}

export default SignatureRequestThumbnail;