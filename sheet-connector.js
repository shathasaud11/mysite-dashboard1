/***********************************************
 *  قراءة المفاتيح السرية من GitHub Secrets
 ***********************************************/
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

/***********************************************
 *  تحديث التوكن
 ***********************************************/
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
        body: params
    });

    const data = await response.json();

    if (!data.access_token) {
        console.error("❌ Failed to generate access token:", data);
        throw new Error("Cannot refresh Google access token.");
    }

    return data.access_token;
}

/***********************************************
 *  قراءة البيانات من Sheets
 ***********************************************/
async function getSheetData() {
    const accessToken = await getAccessToken();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:O`;

    const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    const data = await response.json();

    if (!data.values) return [];

    window.cachedRows = data.values;
    return data.values;
}

/***********************************************
 *  تحديث البيانات في Google Sheets
 ***********************************************/
async function updateSheet(sheetId, range, values) {
    const accessToken = await getAccessToken();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ values })
    });

    const result = await response.json();

    if (result.error) {
        console.error("❌ Error updating sheet:", result);
        throw new Error(result.error.message);
    }

    console.log("Sheet updated:", result);
    return result;
}

/***********************************************
 *  تصدير الدوال
 ***********************************************/
export { getSheetData, updateSheet };
