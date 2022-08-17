import React from 'react';

const ReleaseThumbnail = ( {data} ) => {
	return (
		<article>
			<h3>{data.title}</h3>
			<p>{data.description}</p>
		</article>
	)
}

export default ReleaseThumbnail;