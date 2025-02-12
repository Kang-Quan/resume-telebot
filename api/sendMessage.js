export default async function handler(req, res) {
	if (req.method === "OPTIONS") {
		// Handle CORS preflight request
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.status(204).end();
		return;
	}

	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method Not Allowed" });
	}

	const { name, email, message } = req.body;

	if (!name || !email || !message) {
		return res.status(400).json({ error: "Missing required fields." });
	}

	// Function to escape Markdown characters
	function escapeMarkdown(text) {
		return text.replace(/[_*[\]()~`>#\+=|{}.!-]/g, "\\$&");
	}

	const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
	const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
	const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

	const text = `📩 *New Contact Form Submission*\n\n👤 *Name:* ${escapeMarkdown(name)}\n📧 *Email:* ${escapeMarkdown(email)}\n✉️ *Message:* ${escapeMarkdown(message)}`;

	try {
		const response = await fetch(TELEGRAM_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: TELEGRAM_CHAT_ID,
				text: text,
				parse_mode: "MarkdownV2",
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to send message.");
		}

		// Set CORS headers
		res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all domains (or specify yours)
		res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");

		return res.status(200).json({ message: "Message sent successfully!" });
	} catch (error) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");

		return res.status(500).json({ error: "Internal Server Error" });
	}
}
