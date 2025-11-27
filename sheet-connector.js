/* ============================================================
   الربط مع Google Sheets API باستخدام Refresh Token
   ============================================================ */

// ========== إعداد القيم الثابتة ==========

// رقم الشيت الخاص بك (من الرابط)
const SPREADSHEET_ID = "1k5kAwZvR2uswzKBliEZKE9D1Wlypw1td3S8-specYpQ";

// معرف الورقة Sheet1
const SHEET_NAME = "Sheet1";

// رابط API جوجل لتحديث Token
const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";

// رابط API جوجل للشيت
const GOOGLE_SHEETS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}`;


// ========== معلومات OAuth الخاصة بك ==========
const CLIENT_ID = "310671522798-2rpgv3bvgq6s8e3v3xvq6yx3c5rv0zx4.apps.googleusercontent.com";
const CLIENT_SECRET = "";

// Refresh Token الذي أعطيتِني إياه (آمن لأنه داخل GitHub فقط)
const REFRESH_TOKEN = "";


// ============================================================
// جلب Access Token جديد من Google باستخدام refresh token
// ============================================================

async function getAccessToken() {
    const resp = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            grant_type: "refresh_token"
        })
    });

    const data = await resp.json();
    return data.access_token;
}



// ============================================================
// قراءة البيانات من Google Sheets
// ============================================================

async function getSheetData() {
    const accessToken = await getAccessToken();

    const resp = await fetch(`${GOOGLE_SHEETS_URL}!A2:H200`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    const data = await resp.json();

    return data.values || [];
}



// ============================================================
// حفظ (كتابة) البيانات إلى Google Sheets
// ============================================================

async function updateSheet(rows) {
    const accessToken = await getAccessToken();

    const resp = await fetch(`${GOOGLE_SHEETS_URL}!A2`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            values: rows
        })
    });

    const result = await resp.json();
    console.log("Save result:", result);

    return result;
}


