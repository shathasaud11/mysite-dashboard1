/***********************************************
 *  تحميل بيانات الطالبات من Google Sheets
 ***********************************************/
async function getSheetData() {
    // سيتم تعديل هذه الدالة لاحقًا بعد ربط Google API
    return window.cachedRows || [];
}

/***********************************************
 *  تحميل الجدول الرئيسي
 ***********************************************/
async function loadStudents() {
    const rows = window.cachedRows;
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    rows.forEach((row, index) => {
        if (!row[0]) return;

        const studentNumber = row[0];
        const studentName = row[1];
        const studentClass = row[2];
        const exam = Number(row[3] || 0);
        const practical = Number(row[4] || 0);
        const homework = Number(row[5] || 0);
        const discussion = Number(row[6] || 0);
        const attendance = row[7] || "—";

        const total = exam + practical + homework + discussion;
        const progress = Math.round((total / 100) * 100);

        let status = "";
        if (total >= 90) status = "ممتازة ⭐";
        else if (total >= 80) status = "جيدة جدًا ✨";
        else if (total >= 70) status = "جيدة 👍";
        else if (total >= 60) status = "مقبولة ✔";
        else status = "ضعيفة ⚠";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${studentNumber}</td>
            <td class="clickable-name" data-index="${index}">${studentName}</td>
            <td>${studentClass}</td>
            <td>${exam}</td>
            <td>${practical}</td>
            <td>${homework}</td>
            <td>${discussion}</td>
            <td>${attendance}</td>
            <td>${total}</td>
            <td>${progress}%</td>
            <td>${status}</td>
            <td><button class="small-btn btn-blue" onclick="openStudentCard(${index})">عرض</button></td>
        `;

        tableBody.appendChild(tr);
    });
}

/***********************************************
 *  فتح البطاقة الذكية للطالبة
 ***********************************************/
function openStudentCard(index) {
    const row = window.cachedRows[index];

    document.getElementById("modal-student-name").innerText = row[1];
    document.getElementById("modal-class").innerText = "الفصل: " + row[2];

    // تفريغ الحقول
    clearTagLists();

    document.getElementById("input-plan").value = "";
    document.getElementById("input-report").value = "";
    document.getElementById("input-parent-contact").value = "";
    document.getElementById("parent-contact-note").value = "";

    // إظهار النافذة
    document.getElementById("studentModal").style.display = "block";

    window.currentStudentIndex = index;
}

/***********************************************
 *  إغلاق البطاقة
 ***********************************************/
function closeModal() {
    document.getElementById("studentModal").style.display = "none";
}

/***********************************************
 *  نظام TAGS (نقاط القوة – الضعف – التميز)
 ***********************************************/
function addTag(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (input.value.trim() === "") return;

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.innerHTML = `${input.value} <span class="remove">&times;</span>`;

    tag.querySelector(".remove").onclick = () => tag.remove();

    list.appendChild(tag);
    input.value = "";
}

document.getElementById("input-excellence")?.addEventListener("keypress", e => {
    if (e.key === "Enter") addTag("input-excellence", "list-excellence");
});
document.getElementById("input-strength")?.addEventListener("keypress", e => {
    if (e.key === "Enter") addTag("input-strength", "list-strength");
});
document.getElementById("input-weakness")?.addEventListener("keypress", e => {
    if (e.key === "Enter") addTag("input-weakness", "list-weakness");
});

/***********************************************
 *  تفريغ كل القوائم عند فتح بطاقة جديدة
 ***********************************************/
function clearTagLists() {
    document.getElementById("list-excellence").innerHTML = "";
    document.getElementById("list-strength").innerHTML = "";
    document.getElementById("list-weakness").innerHTML = "";
}

/***********************************************
 *  تواصل ولي الأمر (إظهار مربع إضافي)
 ***********************************************/
document.getElementById("input-parent-contact")?.addEventListener("change", function () {
    const box = document.getElementById("parent-contact-box");
    box.classList.toggle("hidden", this.value !== "نعم");
});

/***********************************************
 *  زر حفظ داخل البطاقة
 ***********************************************/
function saveStudentCard() {
    alert("💾 سيتم إضافة حفظ البيانات في Google Sheets في الخطوة القادمة.\nالآن البطاقة جاهزة بالكامل.");
}

/***********************************************
 *  تحميل البيانات عند فتح الصفحة
 ***********************************************/
window.addEventListener("load", async () => {
    console.log("Loading students...");

    // سيتم استدعاء البيانات لاحقًا من Google Sheets
    loadStudents();
});
