// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI8P_Aqp4R2TpGU8GsZnd7Y-r-TcPCpKc",
  authDomain: "notas-d6da8.firebaseapp.com",
  databaseURL: "https://notas-d6da8.firebaseio.com",
  projectId: "notas-d6da8",
  storageBucket: "notas-d6da8.appspot.com",
  messagingSenderId: "691192984776",
  appId: "1:691192984776:web:4f4ea174f050b411a0a1fd"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const crearPostBtn = document.getElementById('crearPostBtn');
const misPostBtn = document.getElementById('misPostBtn');
const entradaDiv = document.getElementById('entrada')
// Authentication state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        crearPostBtn.style.display = 'inline-block';
        misPostBtn.style.display = 'inline-block';
        entradaDiv.style.display = 'none'; 
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        crearPostBtn.style.display = 'none';
        misPostBtn.style.display = 'none';
        entradaDiv.style.display = 'block';
    }
});

// Login with Google
loginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Helper function to create a slug from a string
function createSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

// Helper function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}