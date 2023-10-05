const uuid = require('uuid').v4;
const postIds = ['313843ca-e1b2-11ed-b5ea-0242ac120002', '370e78c8-e1b2-11ed-b5ea-0242ac120002'];
const posts = {
    '313843ca-e1b2-11ed-b5ea-0242ac120002': {
        id: '313843ca-e1b2-11ed-b5ea-0242ac120002',
        username: 'Maggie',
        imageUrl: 'uploads/cookies.JPG',
        textTitleInput: 'Freshly Baked Cookies!',
        textContentInput: 'Not only do the cookies I make myself look great, they are also incredibly delicious.',
        commentCnt: 2
    },
    '370e78c8-e1b2-11ed-b5ea-0242ac120002': {
        id: '370e78c8-e1b2-11ed-b5ea-0242ac120002',
        username: 'Daniel',
        imageUrl: 'uploads/view.png',
        textTitleInput: 'Hawaii Mood',
        textContentInput: 'Returning to Hawaii after years away has given me a fresh perspective on life and the beauty of the islands.',
        commentCnt: 1
    }
}

const comments = {
    '313843ca-e1b2-11ed-b5ea-0242ac120002': [
        { username: 'Daniel', commentText: 'Looks yummy！' },
        { username: 'Daniel', commentText: 'Just learned a new skill! ' }
    ],
    '370e78c8-e1b2-11ed-b5ea-0242ac120002': [
        { username: 'Maggie', commentText: 'Aloha' }
    ]
}

function addNewPost(username, imageUrl, postTitle, postContent) {
    const id = uuid();
    postIds.push(id);
    posts[id] = { id, username, imageUrl, textTitleInput: postTitle, textContentInput: postContent, "commentCnt": 0 };
}

function findPostById(id) {
    return posts[id];
}

function findPostsByUsername(username) {
    const matchingPosts = [];
    for (const postId of postIds) {
        const post = posts[postId];
        if (post.username === username) {
            matchingPosts.push(post);
        }
    }
    return matchingPosts;
}

function getPostsByPage(requestedPage, requestedSize) {
    const page = parseInt(requestedPage) || 1;
    let pageSize = parseInt(requestedSize) || 2;
    if (pageSize < 2) {
        pageSize = 2;
    }
    const endPage = Math.ceil(postIds.length / pageSize);
    const currentPage = page < 1 || page > endPage ? 1 : page;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = [];
    postIds.slice(startIndex, endIndex).forEach(id => {
        const post = posts[id];
        paginatedData.push(post);
    });
    const nextPage = endIndex >= postIds.length ? -1 : page + 1;
    return { currentPage, nextPage, endPage, paginatedData }
}

function deletePostById(id) {
    const index = postIds.indexOf(id);
    if (index !== -1) {
        postIds.splice(index, 1);
        delete posts[id];
        return true;
    }
    return false;
}

function addNewComment(postId, username, commentText) {
    const foundPost = findPostById(postId);
    if (!foundPost) {
        return false;
    }
    foundPost.commentCnt += 1;
    if (!comments[postId]) {
        comments[postId] = [];
    }
    comments[postId].push({ username, commentText });
    return true;
}

function getPostComments(postId) {
    return comments[postId] || [];
}

function isValidTitle(title) {
    let isValid = !!title && title.trim();
    if (!isValid) {
        return false;
    }
    const regex = /^[a-zA-Z0-9\s\p{P}]+$/u;
    if (title.length > 20) {
        return false;
    }
    return regex.test(title);
}

function isValidTextForContent(content) {
    return !!content && content.trim();
}

module.exports = {
    addNewPost,
    getPostsByPage,
    findPostsByUsername,
    deletePostById,
    findPostById,
    addNewComment,
    getPostComments,
    isValidTitle,
    isValidTextForContent,
};


