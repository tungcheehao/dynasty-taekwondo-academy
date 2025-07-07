const firebaseConfig = {
  apiKey: "AIzaSyDOn4TMNAzchDaM2X8cQN_3GeLw4OPNPnM",
  authDomain: "dynastytkd-2d87e.firebaseapp.com",
  projectId: "dynastytkd-2d87e",
  storageBucket: "dynastytkd-2d87e.appspot.com",
  messagingSenderId: "271608799011",
  appId: "1:271608799011:web:bee1fd1bf4ee1113383696",
  measurementId: "G-NV2HLC2PMC"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

if (location.pathname.endsWith('register.html')) {
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => location.href = "member.html")
      .catch(err => alert(err.message));
  });
}

if (location.pathname.endsWith('login.html')) {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
      .then(() => location.href = "member.html")
      .catch(err => alert(err.message));
  });
}

if (location.pathname.endsWith('member.html')) {
  auth.onAuthStateChanged(user => {
    if (!user) location.href = "login.html";
  });
}

function logout() {
  auth.signOut().then(() => location.href = "login.html");
}
