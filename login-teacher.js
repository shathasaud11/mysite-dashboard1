// كلمة السر للمعلمة
const TEACHER_PASSWORD = "1234"; // يمكن تغييره لاحقاً

function loginTeacher() {
    const input = document.getElementById("teacherPassword").value;
    const error = document.getElementById("errorMsg");

    if (input === TEACHER_PASSWORD) {
        localStorage.setItem("teacherLogged", "true");
        
        window.location.href = "teacher-dashboard.html";

    } else {
        error.textContent = "❌ الرقم السري غير صحيح";
    }
}

