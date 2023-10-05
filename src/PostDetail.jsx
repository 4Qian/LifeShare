import { useEffect, useState, useReducer } from 'react';
import { addComment, getComments, getPostById } from './services';
import { ACTIONS, SERVER } from './constants';
import Status from './Status';

function PostDetail({ curPostId, dispatch }) {
  function reducer(state, action) {
    switch (action.type) {
      case 'succeed':
        return {
          ...state,
          typedCommentText: '',
          submitCommentStatus: 'You have submitted successfully!',
          commentError: ''
        }
      case 'failed':
        return {
          ...state,
          typedCommentText: '',
          submitCommentStatus: '',
          commentError: action.error,
        }
      case 'setComment':
        return {
          ...state,
          typedCommentText: action.typedCommentText,
        }
      default:
        throw new Error({ error: 'unknownUploadAction', detail: action });
    }
  }

  const [commentState, commentDispatch] = useReducer(reducer, { commentError: '', submitCommentStatus: '', typedCommentText: '' });
  const [allComments, setAllComments] = useState([]);
  const [curPost, setCurPost] = useState(null);
  const [postExisted, setPostExisted] = useState(true);

  function onChange(e) {
    commentDispatch({ type: 'setComment', typedCommentText: e.target.value });
  }

  function onSubmitComment(e, postId) {
    e.preventDefault();

    if (isValidComment(commentState.typedCommentText)) {
      addComment(postId, commentState.typedCommentText)
        .then(data => {
          commentDispatch({ type: 'succeed' });
          return fetchComments(postId);
        })
        .catch(error => {
          commentDispatch({ type: 'failed', error: error.error });
          if (error?.error === SERVER.AUTH_MISSING) {
            dispatch({ type: ACTIONS.LOG_OUT });
            dispatch({ type: ACTIONS.RESET_PAGE });
          }
        });
    } else {
      commentDispatch({ type: 'failed', error: SERVER.INVALID_COMMENT });
    }
  }

  function isValidComment(typedCommentText) {
    return !!typedCommentText && typedCommentText.trim();
  }

  function fetchComments(postId) {
    getComments(postId)
      .then(data => {
        setAllComments(data);
      })
      .catch(error => {
        if (error?.error === SERVER.AUTH_MISSING) {
          dispatch({ type: ACTIONS.LOG_OUT });
          dispatch({ type: ACTIONS.RESET_PAGE });
        }
      })
  }

  function onclickRefreshComments() {
    fetchComments(curPostId);
  }

  useEffect(
    () => {
      getPostById(curPostId)
        .then(data => {
          setCurPost(data);
          setPostExisted(true);
          return fetchComments(curPostId);
        })
        .catch(error => {
          if (error?.error === SERVER.AUTH_MISSING) {
            dispatch({ type: ACTIONS.LOG_OUT });
            dispatch({ type: ACTIONS.RESET_PAGE });
          }
          setPostExisted(false);
        });
    },
    []
  );

  return (
    <div>
      {!postExisted && <span>The post you are looking for does not exist.</span>}
      {postExisted && curPost !== null &&
        <div className="post-detail-page">
          <div className="post-detail">
            <img className="post-detail-image" src={curPost.imageUrl} alt="Posted Image" />
            <h4>{curPost.textTitleInput} </h4>
            <span>Author: {curPost.username}</span>
            <span>Content: {curPost.textContentInput}</span>

            <form className="add-comment-form" action="#/login" onSubmit={(e) => onSubmitComment(e, curPost.id)}>
              <span>Leave your comment here: </span>
              <textarea className="comment-text" value={commentState.typedCommentText} onChange={onChange} />
              <button className="submit-comment-button" type="submit">Submit</button>
            </form>
            <span>{commentState.submitCommentStatus}</span>
            {commentState.commentError && <Status error={commentState.commentError} />}
          </div>

          <div className="comments">
            All Comments:
            {
              allComments.map(comment => (
                <div className="comment-detail">{comment.username}: {comment.commentText}</div>
              ))
            }
            <button className="refresh-comments-button" onClick={onclickRefreshComments}>Refresh</button>
          </div>
        </div>
      }
    </div >
  );
}

export default PostDetail;