import React, { useState, useEffect } from 'react';
import Image from '../../../components/Image/Image';
import './SinglePost.css';

import Comment from "./Comment";



const SinglePost = (props) => {
  const [postState, setPostState] = useState({
    title: '',
    creator: '',
    date: '',
    image: '',
    content: '',
    like: [],
    comments: [],
  });

  const [comments, setComments] = useState([]);
  const [addComment, setAddComment] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  const commentSubmitHandler = (event) => {
    event.preventDefault();
    const comment = {
      content: addComment,
      userId: props.userId,
    }

    fetch(`http://localhost:8080/feed/post/comment/post/${props.match.params.postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    })
      .then(res => {
        if (res.status !== 201) {
          throw new Error('Failed to add comment');
        }
        return res.json();
      })
      .then(resData => {
        setComments([...comments, resData.comment]);
        setAddComment('');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const likeHandler = () => {
    const userId = props.userId;

    fetch(`http://localhost:8080/like/${props.match.params.postId}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId })
    })
      .then(res => {
        if (res.status !== 201) {
          throw new Error('Failed to Like Post');
        }
        return res.json();
      })
      .then(resData => {
        setLikeCount(resData.likesCount);
        setUserLiked(!userLiked);
        setPostState({
          ...postState,
          like: resData.like
        });

      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    const postId = props.match.params.postId;

    fetch(`http://localhost:8080/feed/post/${postId}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch post data');
        }
        return res.json();
      })
      .then(resData => {
        setPostState({
          title: resData.post.title,
          creator: resData.post.creator,
          date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
          image: "http://localhost:8080/" + resData.post.imageUrl,
          content: resData.post.content,
          like: resData.post.like,
          comments: resData.post.comments,

        });
        setLikeCount(resData.post.like.length);
        setUserLiked(resData.post.like.includes(props.userId));
      })
      .catch(err => {
        console.log(err);
      });

    fetch(`http://localhost:8080/feed/post/comment/post/${postId}/comments`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch comments');
        }
        return res.json();
      })
      .then((resData) => {
        setPostState({ ...postState, comments: resData.comments });
        setComments(resData.comments);
      })
      .catch(err => {
        console.log(err);
      });

  }, [props.match.params.postId, props.userId, props.like, postState]);




  return (
    <section className="single-post">
      <h1>{postState.title}</h1>
      <h2>
        Created by {postState.creator} on {postState.date}
      </h2>
      <div className="single-post__image">
        <Image contain imageUrl={postState.image} />
      </div>
      <p>{postState.content}</p>
      <p>
        Likes: {likeCount}
        <button onClick={likeHandler}>
          {userLiked ? "Unlike" : "Like"}
        </button>
      </p>
      <p>Comments: {comments.length}</p>
      <div>
        <form method="post">
          Post a comment:
          <input
            type="text"
            name='comment'
            value={addComment}
            onChange={e => setAddComment(e.target.value)}
          />
          <button type="submit" onClick={commentSubmitHandler}>Submit comment</button>
        </form>
      </div>
      <Comment props={props} comments={comments} setPostState={setPostState} />
    </section>
  );
}

export default SinglePost;
