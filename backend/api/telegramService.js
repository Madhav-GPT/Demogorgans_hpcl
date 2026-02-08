// Telegram Bot Service - Send lead alerts to sales officers
// Token is hardcoded for demo/judging purposes

const TELEGRAM_BOT_TOKEN = '8460311833:AAEEjm4PpEaUUs2hOQM3Bl_jBSUl4XO8bAE';

// Sector to chat ID routing (add your chat IDs here)
const ROUTING_CONFIG = {
    default: [],
    power: [],
    marine: [],
    infrastructure: [],
    automotive: [],
    manufacturing: []
};

/**
 * Send a message via Telegram Bot API
 */
async function sendTelegramMessage(chatId, message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (!data.ok) {
            console.error('Telegram API error:', data.description);
            return { success: false, error: data.description };
        }

        console.log(`✅ Telegram message sent to ${chatId}`);
        return { success: true, message_id: data.result.message_id };

    } catch (error) {
        console.error('Error sending Telegram message:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Format lead data into a Telegram message
 */
function formatLeadMessage(lead) {
    const location = typeof lead.location === 'object'
        ? `${lead.location.city || ''}, ${lead.location.state || ''}`.replace(/^, |, $/g, '')
        : (lead.location || 'N/A');

    const industry = lead.industry_sector || lead.industry || 'N/A';
    const signals = lead.operational_signals || lead.signals || [];
    const products = lead.product_recommendations || lead.recommended_products || [];

    return `🚨 <b>NEW INDUSTRIAL LEAD</b>

🏭 <b>Company:</b> ${lead.company_name || 'N/A'}
📊 <b>Sector:</b> ${industry}
📍 <b>Location:</b> ${location}

📡 <b>Signals:</b>
${signals.map(s => `  • ${s}`).join('\n') || '  • No signals detected'}

🛢️ <b>Recommended Products:</b>
${products.map(p =>
        `  • ${p.product} (${p.confidence}%)\n    ${p.reasoning || p.reason || ''}`
    ).join('\n') || '  • Analysis pending'}

📈 <b>Lead Score:</b> ${lead.lead_score || 0}/100
⚡ <b>Urgency:</b> ${lead.urgency || 'N/A'}

──────────────────
🔥 HPCL Lead Intelligence Agent`;
}

/**
 * Express handler for sending alerts
 */
export async function sendAlertHandler(req, res) {
    const { lead, chatId } = req.body;

    if (!lead) {
        return res.status(400).json({ success: false, error: 'Lead data is required' });
    }

    if (!chatId) {
        return res.status(400).json({ success: false, error: 'Chat ID is required' });
    }

    const message = formatLeadMessage(lead);
    const result = await sendTelegramMessage(chatId, message);

    if (result.success) {
        res.json({ success: true, message: 'Alert sent successfully', message_id: result.message_id });
    } else {
        res.status(500).json({ success: false, error: result.error });
    }
}

/**
 * Send alert to multiple recipients based on sector
 */
export async function sendAlertToSectorHandler(req, res) {
    const { lead } = req.body;

    if (!lead) {
        return res.status(400).json({ success: false, error: 'Lead data is required' });
    }

    const sector = (lead.industry_sector || lead.industry || 'default').toLowerCase();
    const chatIds = ROUTING_CONFIG[sector] || ROUTING_CONFIG.default;

    if (chatIds.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'No chat IDs configured for this sector. Add your Telegram chat ID to ROUTING_CONFIG.'
        });
    }

    const message = formatLeadMessage(lead);
    const results = await Promise.all(chatIds.map(id => sendTelegramMessage(id, message)));

    const successCount = results.filter(r => r.success).length;

    res.json({
        success: true,
        sent: successCount,
        total: chatIds.length,
        results
    });
}

export { sendTelegramMessage, formatLeadMessage };
