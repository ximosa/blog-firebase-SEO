const postContent = document.getElementById('post-content');
const postActions = document.getElementById('post-actions');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const commentForm = document.getElementById('comment-form');
const commentText = document.getElementById('comment-text');
const commentsContainer = document.getElementById('comments-container');

const slug = window.location.hash.slice(1);
let currentPostId = null;
let currentPost = null;

function loadPost() {
    const postsRef = firebase.database().ref('posts');
    postsRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if (createSlug(childData.title) === slug) {
                currentPost = childData;
                currentPostId = childSnapshot.key;
                return true; // Break the forEach loop
            }
        });

        if (currentPost) {
            displayPost(currentPost);
            checkPostOwnership(currentPost.authorId);
            setupEditDeleteButtons(currentPostId);
            loadComments(currentPost);
            setupCommentForm(currentPostId);
        } else {
            postContent.innerHTML = '<p>Post no encontrado.</p>';
        }
    });
}

function displayPost(post) {
    document.title = post.title;
    postContent.innerHTML = `
        <h1>${post.title}</h1>
        <p>Por: ${post.author}</p>
        <p>Fecha: ${new Date(post.timestamp).toLocaleString()}</p>
        <div>${post.content}</div>
    `;
}

function checkPostOwnership(authorId) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user && user.uid === authorId) {
            postActions.style.display = 'block';
        } else {
            postActions.style.display = 'none';
        }
        
        if (user) {
            commentForm.style.display = 'block';
        } else {
            commentForm.style.display = 'none';
        }
    });
}

function setupEditDeleteButtons(postId) {
    editBtn.addEventListener('click', () => {
        window.location.href = `crear-post.html?id=${postId}`;
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
            const postRef = firebase.database().ref('posts/' + postId);
            postRef.remove()
                .then(() => {
                    alert('Post eliminado correctamente');
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('Error al eliminar el post:', error);
                    alert('Error al eliminar el post');
                });
        }
    });
}

function loadComments(post) {
    commentsContainer.innerHTML = '';
    if (post.comments) {
        Object.values(post.comments).forEach((comment) => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.author}</strong>: ${comment.text}</p>
                <small>${new Date(comment.timestamp).toLocaleString()}</small>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }
}

function setupCommentForm(postId) {
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        if (user) {
            const commentData = {
                text: commentText.value.trim(),
                author: user.displayName || user.email,
                authorId: user.uid,
                timestamp: Date.now()
            };
            const postRef = firebase.database().ref('posts/' + postId);
            postRef.child('comments').push(commentData)
                .then(() => {
                    commentText.value = '';
                    alert('Comentario publicado correctamente');
                    // Recargar los comentarios
                    loadComments(currentPost);
                })
                .catch((error) => {
                    console.error('Error al publicar el comentario:', error);
                    alert('Error al publicar el comentario');
                });
        } else {
            alert('Debes iniciar sesión para comentar');
        }
    });
}

function createSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

loadPost();