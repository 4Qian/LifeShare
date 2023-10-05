const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();

const PORT = process.env.PORT || 3000;

const sessions = require('./sessions');
const users = require('./users');
const posts = require('./posts');

app.use(cookieParser());
app.use(express.static('./build'));
app.use(express.json());
app.use('/uploads', express.static('./uploads'));

const allowedMimes = ['image/jpeg', 'image/png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });


app.get('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  res.json({ username });
});

app.post('/api/session', (req, res) => {
  const { username } = req.body;
  if (!users.isValid(username)) {
    res.status(400).json({ error: 'required-username' });
    return;
  }

  if (username === 'dog') {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const sid = sessions.addSession(username);
  res.cookie('sid', sid);
  res.json({ username });
});

app.delete('/api/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (sid) {
    res.clearCookie('sid');
  }

  if (username) {
    sessions.deleteSession(sid);
  }
  res.json({ username });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: 'no-file-uploaded' });
    return;
  }

  if (!allowedMimes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'required-image' });
  }

  const localFileName = req.file.filename;
  const imageUrl = 'uploads/' + localFileName;
  const postTitle = req.body.postTitle;

  if (!posts.isValidTitle(postTitle)) {
    return res.status(400).json({ error: 'invalid-title' });
  }

  const postContent = req.body.postContent;

  if (!posts.isValidTextForContent(postContent)) {
    return res.status(400).json({ error: 'invalid-content' });
  }

  posts.addNewPost(username, imageUrl, postTitle, postContent);
  return res.json({ message: 'File uploaded successfully!' });
});

app.delete('/api/deletepost/:postId', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const { postId } = req.params;
  const foundPost = posts.findPostById(postId);

  if (!foundPost) {
    res.status(404).json({ error: 'The post does not exsit' });
    return;
  }

  if (foundPost.username !== username) {
    res.status(403).json({ error: 'The user is not the author of the post' });
    return;
  }

  posts.deletePostById(postId);
  return res.json({ message: 'post deleted successfully' });
});

app.get('/api/userposts', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  res.json(posts.findPostsByUsername(username));
});

app.get('/api/posts', (req, res) => {
  return res.json(posts.getPostsByPage(req.query.page, req.query.size));
});

app.get('/api/post/:postId', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const { postId } = req.params;
  const foundPost = posts.findPostById(postId);

  if (!foundPost) {
    res.status(400).json({ error: 'no-post-found' });
  }
  return res.json(foundPost);
});

app.post('/api/comment', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const { postId, commentText } = req.body;
  if (!posts.addNewComment(postId, username, commentText)) {
    res.status(404).json({ error: 'Post does not exist' });
    return;
  }

  if (!posts.isValidTextForContent(commentText)) {
    return res.status(400).json({ error: 'invalid-comment' });
  }

  return res.json({ message: 'comment added sucessfully' });
});

app.get('/api/comment/:postId', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  const { postId } = req.params;
  return res.json(posts.getPostComments(postId));
});

app.get('/api/bio', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  res.json({ username, bio: users.bioFor[username] || 'You can write something here...' });
});

app.put('/api/bio', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if (!sid || !username) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  const { bio } = req.body;

  if (!bio && bio !== '') {
    res.status(400).json({ error: 'required-word' });
    return;
  }

  if (!users.isValidBio(bio)) {
    res.status(400).json({ error: 'invalid-bio' });
    return;
  }

  users.bioFor[username] = bio;
  res.json({ username, bio });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

