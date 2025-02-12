import "dotenv/config";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { name, email, message } = req.body;

    // Load environment variables
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: "Missing Telegram API credentials" });
    }

    // Message format
    const text = `📩 *New Contact Message*:\n\n👤 *Name:* ${name}\n✉️ *Email:* ${email}\n📝 *Message:* ${message}`;

    const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(TELEGRAM_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text,
                parse_mode: "Markdown",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send message");
        }

        return res.status(200).json({ success: true, message: "Message sent to Telegram!" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send message" });
    }
}
