import "dotenv/config";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const text = `📩 *New Contact Form Submission* 📩\n\n👤 *Name:* ${name}\n✉️ *Email:* ${email}\n📝 *Message:* ${message}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
        });

        const result = await response.json();

        if (!result.ok) throw new Error(result.description);

        return res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to send message" });
    }
}
