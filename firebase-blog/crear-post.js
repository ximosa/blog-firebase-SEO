const postForm = document.getElementById('post-form');
const postTitle = document.getElementById('post-title');
const postContent = document.getElementById('post-content');

const postId = getUrlParameter('id');

// Initialize TinyMCE
tinymce.init({
    selector: '#post-content',
    plugins: 'autolink lists link image charmap print preview anchor',
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
});

if (postId) {
    // If postId exists, we're editing an existing post
    loadPostForEditing();
}

function loadPostForEditing() {
    const postRef = database.ref('posts/' + postId);
    postRef.once('value', (snapshot) => {
        const post = snapshot.val();
        if (post) {
            postTitle.value = post.title;
            tinymce.get('post-content').setContent(post.content);
        } else {
            alert('Post no encontrado');
            window.location.href = 'index.html';
        }
    });
}

postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert('Debes iniciar sesión para crear o editar un post');
        return;
    }

    const title = postTitle.value.trim();
    const content = tinymce.get('post-content').getContent();

    if (!title || !content) {
        alert('Por favor, completa todos los campos');
        return;
    }

    const postData = {
        title: title,
        content: content,
        author: user.displayName,
        authorId: user.uid,
        timestamp: Date.now()
    };

    let saveAction;
    if (postId) {
        // Update existing post
        saveAction = database.ref('posts/' + postId).update(postData);
    } else {
        // Create new post
        saveAction = database.ref('posts').push(postData);
    }

    saveAction.then(() => {
        alert(postId ? 'Post actualizado correctamente' : 'Post creado correctamente');
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error al guardar el post:', error);
        alert('Error al guardar el post: ' + error.message);
    });
});