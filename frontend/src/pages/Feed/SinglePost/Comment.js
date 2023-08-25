import React from 'react';
import Button from '../../../components/Button/Button';

const Comment = ({ props, comments, setPostState }) => {

    const commentDeleteHandler = (commentId) => {
        const userId = props.userId;
        fetch(`http://localhost:8080/feed/post/comment/post/comments/${commentId}`
            , {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, postId: props.match.params.postId }),
            })
            .then(res => {
                if (res.status !== 201) {
                    throw new Error('Failed to Delete Post');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
            })
            .catch(err => { console.log(err); });
    }


    return (
        <div>
            <h3>Comments:</h3>
            <ul>
                {comments.map((comment, index) => (
                    <li key={index}>
                        <p>{comment.content}</p>
                        <p>By {comment.user.name}</p>
                        {comment._id}
                        {/* <Button onClick={commentEditHandler}>Edit</Button> */}
                        <Button onClick={() => commentDeleteHandler(comment._id)}>Delete</Button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Comment;
