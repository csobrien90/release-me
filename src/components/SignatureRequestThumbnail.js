import React from 'react';

const SignatureRequestThumbnail = ( {data, convertTimestamp} ) => {
	const signatures = {
		pending: [],
		signed: []
	};

	data.signatures.forEach(sig => {
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

	return (
		<article>
			<header>
				<h4>Request Info</h4>
				<p className='metadata'>Created: {convertTimestamp(data.createdAt * 1000)}</p>
			</header>
			<ul>
				<li>Subject: {data && data.subject}</li>
				<li>Message: {data && data.message}</li>
			</ul>
			<div className='signature-request'>
				<h4>Signature Requests</h4>
				<dl>
					{signatures.pending.length > 0 && signatures.pending.map((sig, index) => {
						return (
							<React.Fragment key={index}>
								<dt>Pending ({data && signatures.pending.length})</dt>
								<dd>{sig.signerName}</dd>
							</React.Fragment>
						)
					})}
					{signatures.signed.length > 0 && signatures.signed.map((sig, index) => {
						return (
							<React.Fragment key={index}>
								<dt>Signed ({data && signatures.signed.length})</dt>
								<dd>{sig.signerName}</dd>
							</React.Fragment>
						)
					})}
				</dl>
			</div>
		</article>
	)
}

export default SignatureRequestThumbnail;