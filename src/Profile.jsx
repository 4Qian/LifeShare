import { useEffect, useState } from 'react';
import { fetchUserPosts, deletePost, fetchBio } from './services';
import { ACTIONS, SERVER } from './constants';
import Bio from './Bio';
import Loading from './Loading';

function Profile({ dispatch, username }) {
    const [userPosts, setUserPosts] = useState([]);
    const [bio, setBio] = useState('');
    const [displayBioModifyForm, setDisplayBioModifyForm] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isFetchingPosts, setIsFetchingPosts] = useState(false);

    function onClickDeletePost(postId) {
        setIsUploading(true);
        deletePost(postId)
            .then(data => {
                setIsUploading(false);
                dispatch({ type: ACTIONS.RESET_PAGE });
                return fetchUserPosts();
            })
            .then(data => {
                setIsUploading(false);
                setUserPosts(data);
            })
            .catch(error => {
                dispatch({ type: ACTIONS.REPORT_ERROR, error });
                if (error?.error === SERVER.AUTH_MISSING) {
                    dispatch({ type: ACTIONS.LOG_OUT });
                    dispatch({ type: ACTIONS.RESET_PAGE });
                }
            });
    }

    function onClickChangeBio(e) {
        e.preventDefault();
        setDisplayBioModifyForm(true);
    }

    useEffect(() => {
        setIsFetchingPosts(true);
        fetchUserPosts()
            .then(data => {
                setIsFetchingPosts(false);
                setUserPosts(data);
            })
            .catch(error => {
                setIsFetchingPosts(false);
            });
        fetchBio()
            .then(data => {
                setBio(data.bio);
            })
            .catch(error => dispatch({ type: ACTIONS.REPORT_ERROR, error }));
    }, []);

    function onClickPost(e) {
        e.preventDefault();
        dispatch({ type: ACTIONS.ADD_POST })
    }

    return (
        <div className="profile-page">
            <div className="profile-info">
                <h5 className="profile-username">Username: {username} </h5>
                <div className="profile-bio">
                    <h5>Bio: {bio}</h5>
                    <button className="profile-bio-modify-button" onClick={onClickChangeBio}>Modify</button>
                </div>
                {displayBioModifyForm && <Bio setDisplayBioModifyForm={setDisplayBioModifyForm} setBio={setBio}
                    dispatch={dispatch} />}
            </div>

            <div className="profile-my-posts-container">
                <div className="profile-post-delete-guide">
                    {isFetchingPosts && <Loading className="login-waiting">Loading...</Loading>}
                    <span>Note: Deleting a post also removes it from the Discover page!</span>
                </div>
                <div className="profile-my-posts-title">My posts:</div>
                <div className="profile-my-posts">
                    {userPosts.map(post => (
                        <div className="profile-post-detail" key={post.imageUrl}>
                            <img className="profile-image" src={post.imageUrl} alt="Posted Image" />
                            <h4>Title: {post.textTitleInput}</h4>
                            <span>Author: {post.username}</span>
                            <span>Content: {post.textContentInput}</span>
                            <button className="profile-delete-button" onClick={() => onClickDeletePost(post.id)}>Delete</button>
                            {isUploading && <Loading className="login-waiting">Loading...</Loading>}
                        </div>
                    ))}
                    {userPosts.length < 1 &&
                        <div className="profile-empty">
                            <span> You haven't created any posts yet. Try adding a post now!</span>
                            <button className="profile-add-post-button" type="submit" onClick={onClickPost}> Add Post</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Profile;


