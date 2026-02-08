// Test route for Local LLM verification

import { generateLLMResponse, checkOllamaStatus } from "../services/llmService.js";

export async function testLLMHandler(req, res) {
    try {
        // First check Ollama status
        console.log('🔍 Checking Ollama status...');
        const status = await checkOllamaStatus();

        if (!status.available) {
            return res.status(503).json({
                success: false,
                error: status.error,
                status: {
                    ollamaRunning: false,
                    modelInstalled: false
                },
                instructions: [
                    '1. Install Ollama: brew install ollama',
                    '2. Start Ollama: ollama serve',
                    '3. Pull model: ollama pull qwen2.5:1.5b',
                    '4. Retry this endpoint'
                ]
            });
        }

        if (!status.modelInstalled) {
            return res.status(503).json({
                success: false,
                error: status.error,
                status: {
                    ollamaRunning: true,
                    modelInstalled: false
                },
                instructions: [
                    'Run: ollama pull qwen2.5:1.5b',
                    'Then retry this endpoint'
                ]
            });
        }

        // If all good, test a simple prompt
        console.log('✅ Ollama ready, testing LLM...');
        const testPrompt = 'Reply with exactly: "Local LLM is working!" Nothing else.';
        const response = await generateLLMResponse(testPrompt);

        res.json({
            success: true,
            message: 'Local LLM is operational',
            status: {
                ollamaRunning: true,
                modelInstalled: true,
                model: 'qwen2.5:1.5b'
            },
            testResponse: response.trim(),
            endpoint: 'http://localhost:11434/api/generate'
        });

    } catch (error) {
        console.error('❌ LLM test failed:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            instructions: [
                '1. Ensure Ollama is running: ollama serve',
                '2. Ensure model is installed: ollama pull qwen2.5:1.5b',
                '3. Check LOCAL_LLM=true in .env'
            ]
        });
    }
}

export default testLLMHandler;
