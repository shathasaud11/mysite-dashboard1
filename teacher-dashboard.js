// =============================
// 1) إعداد مصدر البيانات
// =============================

// رابط ملف البيانات داخل نفس المستودع
const DATA_URL = "data.json";

// مصفوفة الطالبات في الذاكرة
window.cachedRows = [];

// =============================
// 2) تحميل البيانات من JSON أو من localStorage
// =============================

async function loadStudents() {
    console.log("📌 تحميل بيانات الطالبات...");

    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    try {
        let students = [];

        // أولوية: إذا فيه بيانات محفوظة في localStorage نستخدمها
        const localData = localStorage.getItem("studentsData");
        if (localData) {
            console.log("📂 تم تحميل البيانات من localStorage");
            const parsed = JSON.parse(localData);
            students = parsed.students || [];
        } else {
            // إذا لا توجد بيانات محلية → نقرأ من data.json
            console.log("🌐 تحميل البيانات من data.json");
            const res = await fetch(DATA_URL);
            const json = await res.json();
            students = json.students || [];

            // نحفظ نسخة في localStorage لاستخدامها لاحقًا
            localStorage.setItem("studentsData", JSON.stringify({ students }));
        }

        // نخزنها في الذاكرة للوصول لها من الدوال الأخرى
        window.cachedRows = students;

        if (!students.length) {
            tableBody.innerHTML = "<tr><td colspan='12'>❌ لا توجد بيانات</td></tr>";
            return;
        }

        // تعبئة الجدول
        students.forEach((st, index) => {
            const tr = document.createElement("tr");

            const total = Number(st.exam || 0) +
                          Number(st.practical || 0) +
                          Number(st.homework || 0) +
                          Number(st.discussion || 0);

            // النسبة (من 100) – حسب مجموع 30+30+20+20 = 100
            const progress = total;

            // الحالة بناءً على المجموع
            let status = "بحاجة إلى متابعة";
            if (progress >= 90) status = "ممتازة";
            else if (progress >= 75) status = "جيدة جدًا";
            else if (progress >= 60) status = "جيدة";

            tr.innerHTML = `
                <td>${st.id ?? index + 1}</td>
                <td>${st.name}</td>
                <td>${st.class}</td>
                <td>${st.exam}</td>
                <td>${st.practical}</td>
                <td>${st.homework}</td>
                <td>${st.discussion}</td>
                <td>${st.attendance ?? "-"}</td>
                <td>${total}</td>
                <td>${progress}%</td>
                <td>${status}</td>
                <td>
                    <button class="save-btn" onclick="openStudentCard(${index})">
                        📝 تفاصيل
                    </button>
                </td>
            `;

            tableBody.appendChild(tr);
        });

    } catch (err) {
        console.error("❌ خطأ في تحميل البيانات:", err);
        tableBody.innerHTML = "<tr><td colspan='12'>⚠ حدث خطأ أثناء تحميل البيانات</td></tr>";
    }
}

// =============================
// 3) فتح البطاقة الذكية للطالبة
// =============================

function openStudentCard(index) {
    const row = window.cachedRows[index];

    window.currentStudentIndex = index;

    document.getElementById("modal-student-name").innerText = row[1];
    document.getElementById("modal-class").innerText = "الفصل: " + row[2];

    // تفريغ الحقول
    clearTagLists();
    document.getElementById("input-plan").value = "";
    document.getElementById("input-report").value = "";
    document.getElementById("input-parent-contact").value = "";

    // إظهار النافذة
    document.getElementById("studentModal").style.display = "block";

    // ⭐ تشغيل الذكاء الاصطناعي تلقائيًا
    generateAI();
}

// =============================
// 4) نظام TAGS (نقاط التميز/القوة/الضعف)
// =============================

function addTag(inputId, listId) {
    const input = document.getElementById(inputId);
    const list  = document.getElementById(listId);

    if (!input.value.trim()) return;

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.innerHTML = `
        <span>${input.value.trim()}</span>
        <span class="remove">&times;</span>
    `;

    tag.querySelector(".remove").onclick = () => tag.remove();

    list.appendChild(tag);
    input.value = "";
}

function clearTagLists() {
    document.getElementById("list-excellence").innerHTML = "";
    document.getElementById("list-strength").innerHTML   = "";
    document.getElementById("list-weakness").innerHTML   = "";
}

function fillTagsFromArray(listId, arr) {
    const list = document.getElementById(listId);
    list.innerHTML = "";
    (arr || []).forEach(text => {
        if (!text) return;
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.innerHTML = `
            <span>${text}</span>
            <span class="remove">&times;</span>
        `;
        tag.querySelector(".remove").onclick = () => tag.remove();
        list.appendChild(tag);
    });
}

function extractTags(listId) {
    const tags = [];
    document.querySelectorAll(`#${listId} .tag span:first-child`).forEach(span => {
        const text = span.textContent.trim();
        if (text) tags.push(text);
    });
    return tags;
}

// إدخال سريع عند الضغط على Enter
document.getElementById("input-excellence")?.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTag("input-excellence", "list-excellence");
    }
});
document.getElementById("input-strength")?.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTag("input-strength", "list-strength");
    }
});
document.getElementById("input-weakness")?.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTag("input-weakness", "list-weakness");
    }
});

// إظهار/إخفاء مربع تواصل ولي الأمر
document.getElementById("input-parent-contact")?.addEventListener("change", function () {
    const box = document.getElementById("parent-contact-box");
    box.classList.toggle("hidden", this.value !== "نعم");
});

// =============================
// 5) زر حفظ داخل البطاقة
//    (يُحدّث البيانات في الذاكرة + localStorage فقط)
// =============================

function saveStudentCard() {
    const index = window.currentStudentIndex;
    const st = window.cachedRows[index];
    if (!st) return;

    st.excellence   = extractTags("list-excellence");
    st.strengths    = extractTags("list-strength");
    st.weaknesses   = extractTags("list-weakness");
    st.plan         = document.getElementById("input-plan").value;
    st.report       = document.getElementById("input-report").value;
    st.parentContact= document.getElementById("input-parent-contact").value;
    st.parentNote   = document.getElementById("parent-contact-note").value;

    // حفظ الكل في localStorage
    localStorage.setItem("studentsData", JSON.stringify({ students: window.cachedRows }));

    alert("💾 تم حفظ بيانات الطالبة في هذا الجهاز بنجاح.");
    closeModal();
}

// =============================
// 6) تحميل البيانات عند فتح الصفحة
// =============================
window.addEventListener("load", () => {
    loadStudents();
});
