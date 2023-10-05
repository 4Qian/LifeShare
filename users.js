const bioFor = {};

function isValid(username) {
  let isValid = true;
  isValid = !!username && username.trim();
  isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
  return isValid;
}

function isValidBio(bio) {
  let isValid = !!bio && bio.trim();
  if (!isValid) {
    return false;
  }
  const regex = /^[a-zA-Z0-9\s\p{P}]+$/u;
  if (bio.length > 50) {
    return false;
  }
  return regex.test(bio);
}

module.exports = {
  isValid,
  bioFor,
  isValidBio
};


