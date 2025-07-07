// Firebase 初始化
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
const db = firebase.firestore();

// 注册表单处理
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert("注册成功！");
        window.location.href = "member.html";
      })
      .catch((error) => {
        alert("注册失败：" + error.message);
      });
  });
}

// 登录表单处理
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("登录成功！");
        window.location.href = "member.html";
      })
      .catch((error) => {
        alert("登录失败：" + error.message);
      });
  });
}

// 忘记密码功能
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("重设密码链接已发送至邮箱！");
      })
      .catch((error) => {
        alert("发送失败：" + error.message);
      });
  });
}

// 登出功能
function logout() {
  auth.signOut()
    .then(() => {
      alert("已登出");
      window.location.href = "index.html";
    });
}

// 会员页面加载用户资料
if (window.location.pathname.includes("member.html")) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("userEmail").textContent = user.email;
      const docRef = db.collection("members").doc(user.uid);
      docRef.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          document.getElementById("memberName").value = data.name || "";
          document.getElementById("memberCourse").value = data.course || "";
        }
      });
    } else {
      alert("请先登录！");
      window.location.href = "login.html";
    }
  });

  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("memberName").value.trim();
      const course = document.getElementById("memberCourse").value;
      const user = auth.currentUser;
      if (user) {
        db.collection("members").doc(user.uid).set({ name, course })
          .then(() => {
            alert("资料已保存！");
          })
          .catch((error) => {
            alert("保存失败：" + error.message);
          });
      }
    });
  }
}
