document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentPage = 1;
    const postsPerPage = 5;

    function loadPosts() {
        const postsRef = firebase.database().ref('posts');
        postsRef.orderByChild('timestamp').once('value', (snapshot) => {
            const posts = [];
            snapshot.forEach((childSnapshot) => {
                posts.unshift({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });

            displayPosts(posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage));
            updatePaginationButtons(posts.length);
        });
    }

    function displayPosts(posts) {
        postsContainer.innerHTML = '';
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No hay posts disponibles.</p>';
            return;
        }
        posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            const slug = createSlug(post.title);
            postElement.innerHTML = `
                <h2><a href="post.html#${slug}">${post.title}</a></h2>
                <p>Por: ${post.author}</p>
                <p>Fecha: ${new Date(post.timestamp).toLocaleString()}</p>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    function updatePaginationButtons(totalPosts) {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage * postsPerPage >= totalPosts;
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPosts();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentPage++;
        loadPosts();
    });

    loadPosts();
});

function createSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}