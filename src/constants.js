export const LOGIN_STATUS = {
  PENDING: 'pending',
  NOT_LOGGED_IN: 'notLoggedIn',
  IS_LOGGED_IN: 'loggedIn',
};

export const ACTIONS = {
  SHOW_PROFILE: 'showProfile',
  SHOW_DISCOVER: 'showDiscover',
  SHOW_POST_DETAIL: 'showPostDetail',
  ADD_POST: 'add-post',
  PENDING_LOGIN_STATUS: 'pending-login-status',
  CHECK_SESSION_FAILED: 'check-session-failed',
  LOG_IN: 'login',
  LOG_IN_FAILED: "login-failed",
  LOG_OUT_FAILED: "logout-failed",
  LOG_OUT: 'logout',
  FILL_PAGINATION: 'fill-pagination',
  RESET_PAGE: 'reset-page',
  REPORT_ERROR: 'report-error',
  START_LOADING_DISCOVER: 'start-loading-discover'
};

export const SERVER = {
  AUTH_MISSING: 'auth-missing',
  AUTH_INSUFFICIENT: 'auth-insufficient',
  REQUIRED_USERNAME: 'required-username',
  INVALID_BIO: 'invalid-bio',
  REQUIRED_WORD: 'required-word',
  FILE_NOT_UPLOADED: 'file-not-uploaded',
  INVALID_TITLE: 'invalid-title',
  INVALID_CONTENT: 'invalid-content',
  INVALID_COMMENT: 'invalid-comment',
  NO_FILE_UPLOADED: 'no-file-uploaded',
  FILE_NOT_IMAGE: 'required-image',
};

export const CLIENT = {
  NETWORK_ERROR: 'network-error',
  NO_SESSION: 'no-session',
  UNKNOWN_ACTION: 'unknown-action'
};

export const MESSAGES = {
  [CLIENT.NETWORK_ERROR]: 'Trouble connecting to the network. Please try again!',
  [SERVER.AUTH_INSUFFICIENT]: '"dog" is a disallowed user, please try again!',
  [SERVER.REQUIRED_USERNAME]: 'Please enter a valid (letters and/or numbers) username.',
  [SERVER.INVALID_BIO]: `Please enter a bio that is not blank or more than 50 characters!`,
  [SERVER.AUTH_MISSING]: 'You are not logged in, please log in to continue!',
  [SERVER.FILE_NOT_UPLOADED]: `Please upload a file!`,
  [SERVER.INVALID_TITLE]: `Please enter a valid title that is non-blank and contains no more than 20 characters!`,
  [SERVER.INVALID_CONTENT]: `Please enter a valid content that is not blank!`,
  [SERVER.INVALID_COMMENT]: `Please enter a valid comment that is not blank!`,
  [SERVER.NO_FILE_UPLOADED]: `Please specify an image file to upload!`,
  [SERVER.FILE_NOT_IMAGE]: `Only image files in JPG or PNG format are accepted!`,
  default: 'Something went wrong. Please try again!',
};
