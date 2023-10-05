import { LOGIN_STATUS, CLIENT, ACTIONS, } from './constants';

export const initialState = {
  error: '',
  username: '',
  loginStatus: LOGIN_STATUS.PENDING,
  subview: 'discoverView',
  posts: [],
  curPostId: '',
  nextPage: -1,
  currentPage: 1,
  endPage: -1,
  lastLoginStatus: '',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.RESET_PAGE:
      return {
        ...state,
        currentPage: 1,
        nextPage: -1,
      }
    case ACTIONS.ADD_POST:
      return {
        ...state,
        subview: 'addPostView',
      }
    case ACTIONS.SHOW_POST_DETAIL:
      return {
        ...state,
        subview: 'postDetailView',
        curPostId: action.postId,
      }
    case ACTIONS.SHOW_DISCOVER:
      return {
        ...state,
        subview: 'discoverView',
      }
    case ACTIONS.SHOW_PROFILE:
      return {
        ...state,
        subview: 'profileView',
      }
    case ACTIONS.FILL_PAGINATION:
      return {
        ...state,
        posts: action.paginatedData,
        currentPage: action.currentPage,
        nextPage: action.nextPage,
        endPage: action.endPage,
      }
    case ACTIONS.PENDING_LOGIN_STATUS:
      return {
        ...state,
        lastLoginStatus: state.loginStatus,
        loginStatus: LOGIN_STATUS.PENDING,
      };
    case ACTIONS.LOG_IN:
      return {
        ...state,
        error: '',
        loginStatus: LOGIN_STATUS.IS_LOGGED_IN,
        username: action.username,
      };
    case ACTIONS.LOG_OUT:
      return {
        ...state,
        error: '',
        username: '',
        loginStatus: LOGIN_STATUS.NOT_LOGGED_IN,
        subview: 'discoverView',
      };
    case ACTIONS.LOG_IN_FAILED:
      return {
        ...state,
        loginStatus: LOGIN_STATUS.NOT_LOGGED_IN,
        error: action.error || 'ERROR',
      }
    case ACTIONS.CHECK_SESSION_FAILED:
      return {
        ...state,
        loginStatus: action.error === CLIENT.NO_SESSION ? LOGIN_STATUS.NOT_LOGGED_IN : state.loginStatus,
        error: action.error === CLIENT.NO_SESSION ? state.error : action.error || 'ERROR',
      }
    case ACTIONS.LOG_OUT_FAILED:
      return {
        ...state,
        loginStatus: state.lastLoginStatus,
        error: action.error || 'ERROR',
      }
    case ACTIONS.REPORT_ERROR:
      return {
        ...state,
        error: action.error || 'ERROR',
      };
    default:
      throw new Error({ error: CLIENT.UNKNOWN_ACTION, detail: action });
  }
}

export default reducer;
