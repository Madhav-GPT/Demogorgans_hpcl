import fetch from 'node-fetch';

/**
 * Local LLM Service using Ollama
 * Model: qwen2.5:1.5b (Q4_K_M quantization)
 * Endpoint: http://localhost:11434/api/generate
 */

const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'qwen2.5:1.5b';
const TIMEOUT_MS = 60000; // 60 second timeout

/**
 * Generate a response from the local LLM
 * @param {string} prompt - The prompt to send to the LLM
 * @returns {Promise<string>} - The generated response text
 */
export async function generateLLMResponse(prompt) {
    // Check if local LLM is enabled
    if (process.env.LOCAL_LLM !== 'true') {
        throw new Error('LOCAL_LLM must be set to "true". Cloud models are NOT allowed.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        console.log('🤖 Sending request to local Ollama LLM...');

        const response = await fetch(OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: prompt,
                stream: false
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();

            // Detect specific error conditions
            if (response.status === 404 || errorText.includes('model') && errorText.includes('not found')) {
                throw new Error(`Model "${MODEL_NAME}" not found. Run: ollama pull ${MODEL_NAME}`);
            }

            throw new Error(`Ollama API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        if (!data.response) {
            throw new Error('Empty response from Ollama');
        }

        console.log('✅ Local LLM response received');
        return data.response;

    } catch (error) {
        clearTimeout(timeoutId);

        // Handle specific error types
        if (error.name === 'AbortError') {
            console.error('❌ LLM request timed out after', TIMEOUT_MS / 1000, 'seconds');
            throw new Error('LLM request timed out. The model may be too slow or overloaded.');
        }

        if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
            console.error('❌ Ollama server is not running');
            throw new Error('Ollama server is offline. Run: ollama serve');
        }

        if (error.code === 'ENOTFOUND' || error.message.includes('ENOTFOUND')) {
            console.error('❌ Cannot reach Ollama endpoint');
            throw new Error('Cannot connect to Ollama. Ensure it is running on localhost:11434');
        }

        console.error('❌ LLM Error:', error.message);
        throw error;
    }
}

/**
 * Check if Ollama is available and the model is installed
 * @returns {Promise<{available: boolean, modelInstalled: boolean, error: string|null}>}
 */
export async function checkOllamaStatus() {
    try {
        // Check if server is running
        const tagsResponse = await fetch('http://localhost:11434/api/tags', {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });

        if (!tagsResponse.ok) {
            return { available: false, modelInstalled: false, error: 'Ollama server not responding' };
        }

        const tagsData = await tagsResponse.json();
        const models = tagsData.models || [];
        const modelInstalled = models.some(m => m.name.includes('qwen2.5:1.5b'));

        return {
            available: true,
            modelInstalled,
            error: modelInstalled ? null : `Model ${MODEL_NAME} not installed. Run: ollama pull ${MODEL_NAME}`
        };

    } catch (error) {
        return {
            available: false,
            modelInstalled: false,
            error: 'Ollama server is offline. Run: ollama serve'
        };
    }
}

export default { generateLLMResponse, checkOllamaStatus };
