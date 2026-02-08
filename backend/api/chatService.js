// Chat Service using Local Ollama LLM (qwen2.5:1.5b)

import { generateLLMResponse } from "../services/llmService.js";

export async function chatHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Message required' });
        }

        // Build conversation context from history
        let conversationContext = '';
        if (history.length > 0) {
            // Take last 5 exchanges to keep context manageable
            const recentHistory = history.slice(-10);
            conversationContext = recentHistory.map(h => {
                const role = h.role === 'user' ? 'User' : 'Assistant';
                return `${role}: ${h.content}`;
            }).join('\n');
        }

        const systemPrompt = `You are an AI assistant for HPCL Lead Intelligence Dashboard.
You help users understand B2B leads, HPCL products, and sales strategies.

HPCL Products: Furnace Oil, HSD, LDO, LSHS, Bitumen, Marine Bunker Fuels, Hexane, MTO, JBO.

Be concise, professional, and helpful. Keep responses short (2-3 sentences max).`;

        const fullPrompt = conversationContext
            ? `${systemPrompt}\n\nConversation so far:\n${conversationContext}\n\nUser: ${message}\n\nAssistant:`
            : `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

        console.log('💬 Processing chat with Local Qwen LLM...');

        const responseText = await generateLLMResponse(fullPrompt);

        // Clean up response - remove any trailing "User:" or incomplete parts
        let cleanResponse = responseText.trim();
        const userIndex = cleanResponse.indexOf('\nUser:');
        if (userIndex > 0) {
            cleanResponse = cleanResponse.substring(0, userIndex).trim();
        }

        console.log('✅ Chat response generated');

        res.json({
            success: true,
            response: cleanResponse
        });

    } catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to process chat: ' + error.message
        });
    }
}

export default chatHandler;
