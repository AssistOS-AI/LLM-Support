function GoogleGenAI() {
    this.name = "GoogleGenAI";
    this.models = [
        {
            "modelName": "gemini-2.5-pro",
            "type": "chat",
            "description": "Google's most advanced and capable model for complex reasoning, multimodality (audio, video), and code generation. API model: gemini-2.5-pro-latest",
            "capabilities": ["chat", "completion", "multimodal", "function_calling", "json_mode", "audio_understanding", "video_understanding"],
            "pricing": {
                "input": "1.25",
                "output": "10"
            },
            "contextWindow": 2097152,
            "knowledgeCutoff": "2025-05-01"
        },
        {
            "modelName": "gemini-2.5-flash",
            "type": "chat",
            "description": "A lighter, faster, and more cost-efficient model for a balance of performance and speed. API model: gemini-2.5-flash-latest",
            "capabilities": ["chat", "completion", "multimodal", "function_calling", "json_mode", "audio_understanding"],
            "pricing": {
                "input": "0.3",
                "audioInput": "1",
                "output": "2.5"
            },
            "contextWindow": 2097152,
            "knowledgeCutoff": "2025-05-01"
        },
        {
            "modelName": "gemini-2.5-flash-lite",
            "type": "chat",
            "description": "Our smallest and most cost effective model, built for at scale usage.",
            "capabilities": ["chat", "completion", "multimodal", "function_calling", "json_mode", "audio_understanding"],
            "pricing": {
                "input": "0.1",
                "audioInput": "0.3",
                "output": "0.4"
            },
            "contextWindow": 2097152,
            "knowledgeCutoff": "2025-05-01"
        },
        {
            "modelName": "gemini-2.0-flash-001",
            "type": "chat",
            "description": "Our most balanced multimodal model with great performance across all tasks, with a 1 million token context window, and built for the era of Agents.",
            "capabilities": ["chat", "completion", "multimodal", "function_calling", "json_mode"],
            "pricing": {
                "input": "0.1",
                "audioInput": "0.7",
                "output": "0.4"
            },
            "contextWindow": 1048576,
            "knowledgeCutoff": "June 2024"
        },
        {
            "modelName": "gemini-2-flash-lite",
            "type": "chat",
            "description": "Our smallest and most cost effective model, built for at scale usage.",
            "capabilities": ["chat", "completion", "multimodal", "function_calling", "json_mode"],
            "pricing": {
                "input": "0.075",
                "output": "0.3"
            },
            "contextWindow": 1048576,
            "knowledgeCutoff": "June 2024"
        }
    ]
    //can use stateful chats, how could we use it?
    this.getModels = function () {
        return this.models;
    }
    this.modelExists = function (modelName) {
        let model = this.models.find(m => m.modelName === modelName);
        if (!model) {
            throw new Error(`Provider ${this.name} does not support model ${modelName}`);
        }
    }
    this.getSDKClient = async function () {
        const {GoogleGenAI} = await import('@google/genai');
        return new GoogleGenAI(
            {
                vertexai: false,
                apiVersion: 'v1',
                apiKey: process.env.GOOGLE_GEN_AI_API_KEY
            });
    }
    this.convertHistory = function (chatHistory, constants) {
        let convertedHistory = [];
        for (let reply of chatHistory) {
            if(reply.message === constants.AGENT_PROCESSING_MESSAGE){
                continue;
            }
            let convertedReply = {
                parts: [{text: reply.message}]
            }
            if (reply.role === "human") {
                convertedReply.role = "user";
            } else if (reply.role === "ai") {
                convertedReply.role = "model";
            } else if (reply.role === "system") {
                continue;
            }
            convertedHistory.push(convertedReply);
        }
        return convertedHistory;
    }
    this.getTextResponse = async function (modelName, prompt, options = {}) {
        this.modelExists(modelName);
        let client = await this.getSDKClient();
        const result = await client.models.generateContent({
            model: modelName,
            contents: prompt
        });
        return result.text;
    }

    this.getTextStreamingResponse = function (modelName, prompt, options = {}, onDataChunk) {
        this.modelExists(modelName);
        //call openai lib
    }

    this.getChatCompletionResponse = async function (modelName, chatHistory, options = {}, constants) {
        this.modelExists(modelName);
        let client = await this.getSDKClient();
        let convertedHistory = this.convertHistory(chatHistory, constants);
        let models = await client.models.list();
        const result = await client.models.generateContent({
            model: modelName,
            contents: convertedHistory
        });
        return result.text;
    }

    this.getChatCompletionStreamingResponse = function (modelName, messages, options = {}, onDataChunk) {
        this.modelExists(modelName);
        //call openai lib
    }
}

module.exports = new GoogleGenAI();