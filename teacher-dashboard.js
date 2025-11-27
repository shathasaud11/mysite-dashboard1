// ===============================
// تحميل البيانات من Google Sheets
// ===============================

async function loadStudents() {
    const rows = await getSheetData();  
    console.log("Loaded rows:", rows);

    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    rows.forEach((row, index) => {
        if (!row[0]) return;

        const studentNumber = row[0];
        const studentName   = row[1];
        const studentClass  = row[2];
        const exam30        = Number(row[3] || 0);
        const practical30   = Number(row[4] || 0);
        const homework20    = Number(row[5] || 0);
        const discussion20  = Number(row[6] || 0);
        const attendance    = row[7] || "—";

        // حساب المجموع
        const total = exam30 + practical30 + homework20 + discussion20;

        // حالة الطالبة
        let status = "";
        if (total >= 90) status = "ممتازة ⭐";
        else if (total >= 80) status = "جيدة جدًا ✨";
        else if (total >= 70) status = "جيدة 👍";
        else if (total >= 60) status = "مقبولة ✔";
        else status = "ضعيفة ⚠";

        // نسبة التقدم
        const progress = Math.round((total / 100) * 100);

        // إضافة صف للجدول
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${studentNumber}</td>
            <td class="clickable-name" data-index="${index}">${studentName}</td>
            <td>${studentClass}</td>
            <td><input type="number" value="${exam30}" class="input-grade"></td>
            <td><input type="number" value="${practical30}" class="input-grade"></td>
            <td><input type="number" value="${homework20}" class="input-grade"></td>
            <td><input type="number" value="${discussion20}" class="input-grade"></td>
            <td>${attendance}</td>
            <td><strong>${total}</strong></td>
            <td>${progress}%</td>
            <td>${status}</td>
        `;

        tableBody.appendChild(tr);
    });

    attachNameClickEvents();
}

// =============================================
// عندما تضغط المعلمة على اسم الطالبة → افتح البطاقة
// =============================================
function attachNameClickEvents() {
    document.querySelectorAll(".clickable-name").forEach(cell => {
        cell.addEventListener("click", () => {
            const index = cell.getAttribute("data-index");
            openStudentCard(index);
        });
    });
}

// =============================================
// البطاقة الذكية للطالبة (Modal)
// =============================================

function openStudentCard(index) {
    const rows = window.cachedRows;
    const row = rows[index];

    const studentName = row[1];
    const studentClass = row[2];

    document.getElementById("modal-student-name").innerText = studentName;
    document.getElementById("modal-class").innerText = studentClass
