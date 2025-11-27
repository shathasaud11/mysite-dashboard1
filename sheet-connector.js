// =========================================
// Secure Google Sheets Connector (GitHub Secrets)
// =========================================

// 🔐 قراءة المفاتيح من GitHub Actions (Backend Only)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// =========================================
// Google OAuth Token Refresh
// =========================================

async function getAccessToken() {
    const url = "https://oauth2.googleapis.com/token";

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("refresh_token", REFRESH_TOKEN);
    params.append("grant_type", "refresh_token");

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });

    const data = await response.json();

    if (!data.access_token) {
        console.error("❌ Failed to get access token:", data);
        throw new Error("Access token error");
    }

    return data.access_token;
}

// =========================================
// 🔄 قراءة البيانات من Google Sheets
// =========================================

async function loadSheet(sheetId, range) {
    const token = await getAccessToken();

    const url =
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    return data.values || [];
}

// =========================================
// ✍️ كتابة البيانات في Google Sheets
// =========================================

async function updateSheet(sheetId, range, values) {
    const token = await getAccessToken();

    const url =
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ values }),
    });

    const data = await response.json();

    return data;
}

// =========================================
// 🌟 Export للملفات الأخرى
// =========================================

export { loadSheet, updateSheet };
