import React from 'react';
import TextEditor from '../text-editor';
import AnchorBase from '../anchor-base';
import CommentContainer from '../comment-container';

const Home = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-around',
			}}>
			<TextEditor />
		</div>
	);
};

export default Home;
