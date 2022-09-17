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
			<h4>Request Info</h4>
			<p>Created: {convertTimestamp(data.createdAt * 1000)}</p>
			<ul>
				<li>Subject: {data && data.subject}</li>
				<li>Message: {data && data.message}</li>
			</ul>
			<h5>Signature Requests ({data && data.signatures.length})</h5>
			<dl>
				{signatures.pending.length > 0 && signatures.pending.map((sig, index) => {
					return (
						<React.Fragment key={index}>
							<dt>Pending:</dt>
							<dd>{sig.signerName}</dd>
						</React.Fragment>
					)
				})}
				{signatures.signed.length > 0 && signatures.signed.map((sig, index) => {
					return (
						<React.Fragment key={index}>
							<dt>Signed:</dt>
							<dd>{sig.signerName}</dd>
						</React.Fragment>
					)
				})}
			</dl>
		</article>
	)
}

export default SignatureRequestThumbnail;