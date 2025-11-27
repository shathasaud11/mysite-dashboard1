
// ===============================
// تحميل البيانات من Google Sheets
// ===============================

async function loadStudents() {
    const rows = await getSheetData();  // دالة من sheet-connector.js
    console.log("Loaded rows:", rows);

    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    rows.forEach((row, index) => {
        if (!row[0]) return; // تخطي الصفوف الفارغة

        const studentNumber     = row[0];
        const studentName       = row[1];
        const studentClass      = row[2];
        const exam30            = Number(row[3] || 0);
        const practical30       = Number(row[4] || 0);
        const homework20        = Number(row[5] || 0);
        const discussion20      = Number(row[6] || 0);
        const attendance        = row[7];

        // حساب المجموع
        const total = exam30 + practical30 + homework20 + discussion20;

        // نسبة التقدم (حساب تقريبي)
        const progress = Math.round((total / 100) * 100) + "%";

        // إضافة الصف إلى الجدول
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${studentNumber}</td>
            <td class="clickable-name" data-index="${index}">${studentName}</td>
            <td>${studentClass}</td>
            <td><input type="number" value="${exam30}" class="input-grade"></td>
            <td><input type="number" value="${practical30}" class="input-grade"></td>
            <td><input type="number" value="${homework20}" class="input-grade"></td>
            <td><input type="number" value="${discussion20}" class="input-grade"></td>
