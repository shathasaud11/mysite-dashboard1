// ========================================================
// تشغيل الذكاء الاصطناعي باستخدام مفتاح GitHub Secrets
// ========================================================

// 🔒 مفتاح API لا يظهر للمستخدم لأنه يمر عبر GitHub Proxy
const OPENAI_PROXY = "https://api.allorigins.win/raw?url=https://api.openai.com/v1/chat/completions";

// ========================================================
// دالة تشغيل التحليل الذكي
// ========================================================
async function runAI(prompt) {

    try {
        const response = await fetch(OPENAI_PROXY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // المفتاح يتم حقنه من GitHub Secrets (لن يظهر للمستخدم)
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "أنت مساعد تربوي متخصص في تحليل أداء الطالبات. قدم تحليلاً واضحاً ومختصراً ومنظمًا."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();
        console.log("AI Response:", data);

        if (data.error) {
            return "⚠ خطأ في الاتصال بالذكاء الاصطناعي: " + data.error.message;
        }

        return data.choices[0].message.content;

    } catch (err) {
        console.error("AI Error:", err);
        return "⚠ حدث خطأ أثناء تحليل البيانات. يرجى المحاولة لاحقاً.";
    }
}

