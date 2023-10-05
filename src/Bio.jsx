import { useState } from 'react';
import { updateBio } from './services';
import Loading from './Loading';
import { SERVER, ACTIONS } from './constants';
import Status from './Status';

function Bio({ setDisplayBioModifyForm, setBio, dispatch }) {

    const [typedBio, setTypedBio] = useState('');
    const [isUpdatingBio, setIsUpdatingBio] = useState(false);
    const [bioModifyError, setBioModifyError] = useState('');

    function handleUpdateBio(e) {
        e.preventDefault();
        setIsUpdatingBio(true);
        updateBio(typedBio)
            .then(data => {
                setBioModifyError('');
                setBio(data.bio);
                setIsUpdatingBio(false);
                setDisplayBioModifyForm(false);
            })
            .catch(err => {
                setBioModifyError(err?.error || 'ERROR');
                setIsUpdatingBio(false);
                if (err?.error === SERVER.AUTH_MISSING) {
                    dispatch({ type: ACTIONS.LOG_OUT });
                    dispatch({ type: ACTIONS.RESET_PAGE });
                }
                setDisplayBioModifyForm(true);
            });
        setTypedBio('');
    }

    function cancelModifiyingBio() {
        setBioModifyError('');
        setTypedBio('');
        setDisplayBioModifyForm(false);
    }

    function onTyping(event) {
        setTypedBio(event.target.value);
    }

    return (
        <div>
            {isUpdatingBio && <Loading className="updating">Updating...</Loading>}
            <form className="bio-change-form">
                <div>
                    <label>
                        <input className="bio-change-input" value={typedBio} onChange={onTyping} placeholder="Type here" />
                    </label>
                    <button className="bio-change-button" type="button" onClick={handleUpdateBio}>Change</button>
                    <button className="bio-cancel-button" type="button" onClick={cancelModifiyingBio}>Cancel</button>
                </div>
                <small className="bio-guide">Bio cannot be blank or more than 50 characters.</small>
                {bioModifyError && <Status error={bioModifyError} />}
            </form>
        </div>
    );
}

export default Bio;

