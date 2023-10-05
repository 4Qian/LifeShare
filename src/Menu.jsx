import { ACTIONS } from './constants';


function Menu({ dispatch, onLogout }) {
    function onClickPost(e) {
        e.preventDefault();
        dispatch({ type: ACTIONS.ADD_POST })
    }

    function onClickDiscover(e) {
        e.preventDefault();
        dispatch({ type: ACTIONS.SHOW_DISCOVER })
    }

    function onClickProfile(e) {
        e.preventDefault();
        dispatch({ type: ACTIONS.SHOW_PROFILE })
    }

    return (
        <div className="menu">
            <button className="menu-item" type="submit" onClick={onClickDiscover}>Discover</button>
            <button className="menu-item" type="submit" onClick={onClickPost}>Add</button>
            <button className="menu-item" type="submit" onClick={onClickProfile}>Profile</button>
            <button className="menu-item" onClick={onLogout}>Logout</button>
        </div>
    );
}

export default Menu;