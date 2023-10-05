import { useReducer, useRef } from 'react';
import { uploadPost } from './services';
import Status from './Status';
import Loading from './Loading';
import { ACTIONS, SERVER } from './constants';

function AddNewPost({ dispatch }) {

  const inputFileRef = useRef();

  function reducer(state, action) {
    switch (action.type) {
      case 'success':
        return {
          ...state,
          uploadStatus: 'Upload successful!',
          uploadError: '',
          isUploading: false,
          file: null,
          title: '',
          content: '',
        }
      case 'uploading':
        return {
          ...state,
          isUploading: true,
        }
      case 'failed':
        return {
          ...state,
          isUploading: false,
          uploadStatus: '',
          uploadError: action.error,
        }
      case 'setFile':
        return {
          ...state,
          file: action.file,
        }
      case 'setTitle':
        return {
          ...state,
          title: action.title,
        }
      case 'setContent':
        return {
          ...state,
          content: action.content,
        }
      default:
        throw new Error({ error: 'unknownUploadAction', detail: action });
    }
  }

  const [uploadState, uploadDispatch] = useReducer(reducer, {
    uploadError: '',
    uploadStatus: '', isUploading: false, file: null, title: '', content: ''
  });

  const handleFileInputChange = (e) => {
    uploadDispatch({ type: 'setFile', file: e.target.files[0] });
  };

  const handleTitleChange = (e) => {
    uploadDispatch({ type: 'setTitle', title: e.target.value });
  };

  const handleContentChange = (e) => {
    uploadDispatch({ type: 'setContent', content: e.target.value });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    uploadDispatch({ type: 'uploading' });
    uploadPost(uploadState.file, uploadState.title, uploadState.content)
      .then(response => {
        uploadDispatch({ type: 'success' });
        inputFileRef.current.value = '';
      })
      .catch(error => {
        uploadDispatch({ type: 'failed', error: error.error });
        if (error?.error === SERVER.AUTH_MISSING) {
          dispatch({ type: ACTIONS.LOG_OUT });
          dispatch({ type: ACTIONS.RESET_PAGE });
        }
      });
  }

  return (
    <div className="add-post">
      <span>Please choose one picture you'd like to share:</span>
      <form className="add-post-form" onSubmit={handlePostSubmit}>
        <input className="add-post-image-input" type="file" onChange={handleFileInputChange} ref={inputFileRef} />
        <input className="add-post-title-input" type="text" value={uploadState.title} onChange={handleTitleChange} placeholder="Enter title here" />
        <small className="title-guide">Title cannot be blank or more than 20 characters.</small>
        <textarea className="add-post-content-input" type="text" value={uploadState.content} onChange={handleContentChange} placeholder="Enter content here" />
        <small className="content-guide">Content cannot be blank.</small>
        <div className="add-post-upload">
          <button className="add-post-upload-button" type="submit">Upload</button>
          {uploadState.isUploading && <Loading className="login-waiting">Loading...</Loading>}
        </div>
      </form>
      <span>{uploadState.uploadStatus}</span>
      {uploadState.uploadError && <Status error={uploadState.uploadError} />}
    </div>
  );
}

export default AddNewPost;

