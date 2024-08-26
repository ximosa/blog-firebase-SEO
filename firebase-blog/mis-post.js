const myPostsContainer = document.getElementById('my-posts-container');

function loadMyPosts() {
    const user = auth.currentUser;
    if (!user) {
        myPostsContainer.innerHTML = '<p>Debes iniciar sesión para ver tus posts.</p>';
        return;
    }

    const postsRef = database.ref('posts');
    postsRef.orderByChild('authorId').equalTo(user.uid).once('value', (snapshot) => {
        myPostsContainer.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const post = childSnapshot.val();
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2><a href="post.html?id=${childSnapshot.key}">${post.title}</a></h2>
                <p>Fecha: ${new Date(post.timestamp).toLocaleString()}</p>
                <button onclick="editPost('${childSnapshot.key}')">Editar</button>
                <button onclick="deletePost('${childSnapshot.key}')">Eliminar</button>
            `;
            myPostsContainer.appendChild(postElement);
        });

        if (myPostsContainer.children.length === 0) {
            myPostsContainer.innerHTML = '<p>No tienes posts publicados aún.</p>';
        }
    });
}

function editPost(postId) {
    window.location.href = `crear-post.html?id=${postId}`;
}

function deletePost(postId) {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
        const postRef = database.ref('posts/' + postId);
        postRef.remove()
            .then(() => {
                alert('Post eliminado correctamente');
                loadMyPosts();
            })
            .catch((error) => {
                console.error('Error al eliminar el post:', error);
                alert('Error al eliminar el post');
            });
    }
}

auth.onAuthStateChanged((user) => {
    if (user) {
        loadMyPosts();
    } else {
        myPostsContainer.innerHTML = '<p>Debes iniciar sesión para ver tus posts.</p>';
    }
});