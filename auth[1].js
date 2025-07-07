const firebaseConfig = {
  apiKey: "AIzaSyDOn4TMNAzchDaM2X8cQN_3GeLw4OPNPnM",
  authDomain: "dynastytkd-2d87e.firebaseapp.com",
  projectId: "dynastytkd-2d87e",
  storageBucket: "dynastytkd-2d87e.firebasestorage.app",
  messagingSenderId: "271608799011",
  appId: "1:271608799011:web:bee1fd1bf4ee1113383696",
  measurementId: "G-NV2HLC2PMC"
};
firebase.initializeApp(firebaseConfig);

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => window.location.href = "member.html")
    .catch(error => alert(error.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "member.html")
    .catch(error => alert(error.message));
}

function logout() {
  firebase.auth().signOut().then(() => window.location.href = "login.html");
}

firebase.auth().onAuthStateChanged(user => {
  if (window.location.pathname.includes("member.html") && !user) {
    window.location.href = "login.html";
  }
});