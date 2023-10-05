export function fetchLogin(username) {
  return fetch('/api/session', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({ username }),
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function fetchSession() {
  return fetch('/api/session', {
    method: 'GET',
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function fetchLogout() {
  return fetch('/api/session', {
    method: 'DELETE',
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function uploadPost(file, postTitle, postContent) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('postTitle', postTitle);
  formData.append('postContent', postContent);
  return fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function deletePost(postId) {
  return fetch(`/api/deletepost/${postId}`, {
    method: 'DELETE',
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function fetchPaginatedPosts(page) {
  return fetch(`/api/posts?page=${page}&size=2`, {
    method: 'GET',
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function fetchUserPosts() {
  return fetch('/api/userposts', {
    method: 'GET',
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function addComment(postId, commentText) {
  return fetch('/api/comment', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ postId, commentText }),
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function getPostById(postId) {
  return fetch(`/api/post/${postId}`, {
    method: 'GET',
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function getComments(postId) {
  return fetch(`/api/comment/${postId}`, {
    method: 'GET',
  })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

export function updateBio(newBio) {
  return fetch('/api/bio', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ bio: newBio }),
  })
    .catch((err) => Promise.reject({ error: 'network-error' }))
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json();
    });
}

export function fetchBio() {
  return fetch('/api/bio')
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json()
        .catch(error => Promise.reject({ error }))
        .then(err => Promise.reject(err));
    });
}

