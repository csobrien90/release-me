import React from 'react';

const ReleaseThumbnail = ( {data, sortSignatures, convertTimestamp} ) => {
	const sortedSignatures = sortSignatures(data.requestedSignatures);

	return (
		<article>
			<div>
				<h3>{data.title}</h3>
				<div className='release-thumbnails-dates'>
					<p>Created: 
						<span>{convertTimestamp(data.created)}</span>
					</p>
					<p>Last modified: 
						<span>{convertTimestamp(data.modified)}</span>
					</p>
				</div>
			</div>
			<p className='release-thumbnail-description'>{data.description}</p>
			<dl>
				<dd>{sortedSignatures.pending.length + sortedSignatures.signed.length} signature requests</dd>
				{sortedSignatures.pending.length > 0 && <dd>{sortedSignatures.pending.length} pending</dd>}
				{sortedSignatures.signed.length > 0 && <dd>{sortedSignatures.signed.length} completed</dd>}
			</dl>
		</article>
	)
}

export default ReleaseThumbnail;