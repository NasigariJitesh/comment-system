import { CreateCommentInput } from '../../api-calls';

export interface Comment {
	commentedBy: {
		firstName: string;
		lastName: string;
	};
	content: string;
	id: string;
	position: {
		pageX: number;
		pageY: number;
	};
	document: string;
	_id: string;
}

export const getSortedComments = (comments: Comment[]) => {
	const commentsArray = [...comments];

	commentsArray.sort((a, b) => {
		return a.position.pageY - b.position.pageY === 0
			? a.position.pageY - b.position.pageY
			: a.position.pageX - b.position.pageX;
	});
	commentsArray.forEach((comment, id, array) => {
		for (let i = id + 1; i < array.length; i++) {
			if (array[i].position.pageY <= commentsArray[id].position.pageY + 135) {
				console.log('hi');
				commentsArray[i] = {
					...commentsArray[i],
					position: {
						...array[i].position,
						pageY: comment.position.pageY + 135,
					},
				};
			}
		}
	});

	return commentsArray;
};
