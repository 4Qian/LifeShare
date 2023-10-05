import { useEffect, useState } from 'react';
import { fetchPaginatedPosts } from './services';
import { LOGIN_STATUS, ACTIONS } from './constants';
import Loading from './Loading';

function Discover({ disableDetail, state, dispatch }) {

  const [isUploading, setIsUploading] = useState(false);

  function onClickShowPostDetail(postId) {
    if (disableDetail) {
      return;
    }
    dispatch({ type: ACTIONS.SHOW_POST_DETAIL, postId })
  }

  function onClickShowPrevious(e) {
    e.preventDefault();
    showPage(state.currentPage - 1);
  }

  function onClickShowFirstPage(e) {
    e.preventDefault();
    showPage(1);
  }

  function onClickShowLastPage(e) {
    e.preventDefault();
    showPage(state.endPage);
  }

  function onClickShowNext(e) {
    e.preventDefault();
    showPage(state.nextPage)
  }

  function showPage(page) {
    setIsUploading(true);
    fetchPaginatedPosts(page)
      .then(data => {
        setIsUploading(false);
        if (Array.isArray(data.paginatedData)) {
          dispatch({ ...data, type: ACTIONS.FILL_PAGINATION })
        } else {
          setIsUploading(false);
        }
      })
      .catch(error => dispatch({ type: ACTIONS.REPORT_ERROR, error }));
  }

  useEffect(() => {
    showPage(state.currentPage);
  }, []);

  const discoverPage = state.loginStatus === LOGIN_STATUS.NOT_LOGGED_IN ? "discover-not-logged-in-page" : "discover-page";

  return (
    <div className={discoverPage}>
      {isUploading && <Loading className="login-waiting">Loading...</Loading>}
      <div className="discover-page-guide">Click on the post to view its details!</div>
      {state.posts.map(post => (
        <div className="discover-post" key={post.imageUrl}>
          <img className="discover-post-image" src={post.imageUrl} onClick={() => onClickShowPostDetail(post.id)} alt="Posted Image" />
          <h4 className="discover-post-title" onClick={() => onClickShowPostDetail(post.id)}>{post.textTitleInput}</h4>
          <span className="discover-post-author" onClick={() => onClickShowPostDetail(post.id)}>Author: {post.username}</span>
          <span className="discover-post-comment" onClick={() => onClickShowPostDetail(post.id)}>Comment ({post.commentCnt})</span>
        </div>
      ))}

      <div className="discover-button-container">
        <button className="first-button" onClick={onClickShowFirstPage}>First</button>
        {state.currentPage > 1 && <button className="previous-button" onClick={onClickShowPrevious}>Previous</button>}
        {state.nextPage !== -1 && <button className="next-button" onClick={onClickShowNext}>Next</button>}
        <button className="last-button" onClick={onClickShowLastPage}>Last({state.endPage}) </button>
      </div>
    </div>
  );
}

export default Discover;

