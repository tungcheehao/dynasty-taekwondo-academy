
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  measurementId: "MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 注册处理
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const role = document.getElementById("registerRole").value;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return db.collection("users").doc(user.uid).set({
          email: email,
          role: role,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        alert("注册成功！");
        if (role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "student_zone.html";
        }
      })
      .catch((error) => {
        alert("注册失败：" + error.message);
      });
  });
}

// 登录处理
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const roleSelected = document.getElementById("loginRole").value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return db.collection("users").doc(user.uid).get();
      })
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          if (userData.role !== roleSelected) {
            alert("身份选择错误，请检查。");
            auth.signOut();
            return;
          }
          if (userData.role === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "student_zone.html";
          }
        } else {
          alert("用户资料未找到。");
        }
      })
      .catch((error) => {
        alert("登录失败：" + error.message);
      });
  });
}
