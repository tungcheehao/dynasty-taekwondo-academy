// ✅ 1. Firebase 配置与初始化
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
const storage = firebase.storage();

// ✅ 2. 注册功能
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
          email,
          role,
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
      .catch((error) => alert("注册失败：" + error.message));
  });
}

// ✅ 3. 登录功能
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
      .catch((error) => alert("登录失败：" + error.message));
  });
}

// ✅ 4. 监听登录状态
auth.onAuthStateChanged((user) => {
  if (user && document.getElementById("studentProfileForm")) {
    loadStudentProfile(user.uid);
  }
});

// ✅ 5. 加载学生资料
function loadStudentProfile(uid) {
  db.collection("students").doc(uid).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById("nameCn").value = data.nameCn || "";
        document.getElementById("nameEn").value = data.nameEn || "";
        document.getElementById("nric").value = data.nric || "";
        document.getElementById("dob").value = data.dob || "";
        document.getElementById("gender").value = data.gender || "";
        document.getElementById("age").value = data.age || "";
        document.getElementById("school").value = data.school || "";
        document.getElementById("address").value = data.address || "";
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("parentName").value = data.parentName || "";
        document.getElementById("parentNric").value = data.parentNric || "";
        document.getElementById("parentPhone").value = data.parentPhone || "";
        document.getElementById("coach").value = data.coach || "";
        document.getElementById("enrollDate").value = data.enrollDate || "";
      }
    })
    .catch((error) => console.error("读取学生资料失败:", error));
}

// ✅ 6. 绑定学生资料保存事件
const studentForm = document.getElementById("studentProfileForm");
if (studentForm) {
  studentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("未登录");

    const data = {
      nameCn: document.getElementById("nameCn").value,
      nameEn: document.getElementById("nameEn").value,
      nric: document.getElementById("nric").value,
      dob: document.getElementById("dob").value,
      gender: document.getElementById("gender").value,
      age: document.getElementById("age").value,
      school: document.getElementById("school").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
      parentName: document.getElementById("parentName").value,
      parentNric: document.getElementById("parentNric").value,
      parentPhone: document.getElementById("parentPhone").value,
      coach: document.getElementById("coach").value,
      enrollDate: document.getElementById("enrollDate").value,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // 上传学生照片
    const fileInput = document.getElementById("studentPhoto");
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const storageRef = storage.ref().child(`student_photos/${user.uid}`);
      await storageRef.put(file);
      const photoURL = await storageRef.getDownloadURL();
      data.photoURL = photoURL;
    }

    // 存到 Firestore
    db.collection("students").doc(user.uid).set(data, { merge: true })
      .then(() => alert("学生资料已保存"))
      .catch((error) => alert("保存失败：" + error.message));
  });
}

// ✅ 7. 登出功能
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login_register.html";
  });
}
