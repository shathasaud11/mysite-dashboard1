const SHEET_ID = "1k5kAwZvR2uswzKBliEZKE9D1Wlypw1td3S8-specYpQ";

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

    console.log("📌 Testing getSheetData...");

    const rows = await getSheetData();
    console.log("📌 Rows loaded:", rows);

    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if (!rows || rows.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='17'>❌ لا توجد بيانات</td></tr>";
        return;
    }

    rows.forEach((row, index) => {
        if (!row[0]) return;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row[4]}</td>
            <td>${row[5]}</td>
            <td>${row[6]}</td>
            <td>${row[7]}</td>
            <td>${row[3] + row[4] + row[5] + row[6]}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>تفاصيل</td>
            <td>❌</td>
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
function extractTags(listId) {
    const tags = [];
    document.querySelectorAll(`#${listId} .tag`).forEach(tag => {
        const text = tag.childNodes[0].textContent.trim();
        if (text) tags.push(text);
    });
    return JSON.stringify(tags); // تحويلها إلى JSON قبل الحفظ
}
async function saveStudentCard() {
    const index = window.currentStudentIndex;
    const row = window.cachedRows[index];

    const excellenceJSON = extractTags("list-excellence");  // عمود J (9)
    const strengthJSON   = extractTags("list-strength");    // عمود K (10)
    const weaknessJSON   = extractTags("list-weakness");    // عمود L (11)
    const planText       = document.getElementById("input-plan").value;  // M (12)
    const parentChoice   = document.getElementById("input-parent-contact").value; // N (13)
    const reportText     = document.getElementById("input-report").value; // O (14)

    // تعديل البيانات في الصف داخل الذاكرة أولًا
    row[9]  = excellenceJSON;
    row[10] = strengthJSON;
    row[11] = weaknessJSON;
    row[12] = planText;
    row[13] = parentChoice;
    row[14] = reportText;

    // تحديث الصف داخل Google Sheets
    await updateSheet(
        SHEET_ID,
        `Sheet1!J${index + 1}:O${index + 1}`,
        [[
            excellenceJSON,
            strengthJSON,
            weaknessJSON,
            planText,
            parentChoice,
            reportText
        ]]
    );

    alert("تم حفظ بيانات الطالبة بنجاح! 🎉");
    closeModal();
}

