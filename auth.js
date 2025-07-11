// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyDOn4TMNAzchDaM2X8cQN_3GeLw4OPNPnM",
  authDomain: "dynastytkd-2d87e.firebaseapp.com",
  projectId: "dynastytkd-2d87e",
  storageBucket: "dynastytkd-2d87e.appspot.com", // ⚠️ 更正了你的 bucket 域名
  messagingSenderId: "271608799011",
  appId: "1:271608799011:web:bee1fd1bf4ee1113383696",
  measurementId: "G-NV2HLC2PMC"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

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

// 忘记密码处理
const resetForm = document.getElementById("resetForm");
if (resetForm) {
  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value.trim();
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("密码重设邮件已发送！");
      })
      .catch((error) => {
        alert("发送失败：" + error.message);
      });
  });
}

// 登出函数
function logout() {
  auth.signOut()
    .then(() => {
      alert("已登出");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("登出失败：" + error.message);
    });
}

// 显示已登录用户
auth.onAuthStateChanged((user) => {
  if (user && document.getElementById("userEmail")) {
    document.getElementById("userEmail").textContent = user.email;
  }
});
