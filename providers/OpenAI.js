function OpenAI(){
    this.name = "OpenAI";
    this.models = [
        {
            modelName: "o1-mini",
            type: "chat",
            description: "Smaller variant of o1-preview for high-output generation",
            capabilities: ["completion"],
            pricing: {
                "input": "1.1",
                "output": "4.4"
            },
            contextWindow: 128000,
            knowledgeCutoff: "2024-09-12"
        },
        {
            modelName: "gpt-4o-mini",
            type: "chat",
            description: "",
            capabilities: ["completion"],
            pricing: {
                "input": "0.15",
                "output": "0.6"
            },
            contextWindow: 128000,
            knowledgeCutoff: "2024-07-18"
        },
        {
            modelName: "gpt-4.1-nano",
            type: "chat",
            description: "",
            capabilities: ["completion"],
            pricing: {
                "input": "0.1",
                "output": "0.4"
            },
            contextWindow: 128000,
            knowledgeCutoff: "2025-04-14"
        }
    ]

    this.getModels = function (){
        return this.models;
    }
    this.modelExists = function (modelName){
        let model = this.models.find(m => m.modelName === modelName);
        if(!model) {
            throw new Error(`Provider ${this.name} does not support model ${modelName}`);
        }
    }
    this.getSDKClient = async function () {
        const OpenAISDK = (await import('openai')).default;
        return new OpenAISDK(
            {
                apiKey: process.env.OPENAI_API_KEY
            });
    }
    this.convertHistory = function (chatHistory) {
        let convertedHistory = [];
        for (let reply of chatHistory) {
            let convertedReply = {
                content: reply.message
            }
            if(reply.role === "human") {
                convertedReply.role = "user";
            } else if(reply.role === "ai") {
                convertedReply.role = "assistant";
            } else if(reply.role === "system") {
                convertedReply.role = "developer";
            }
            convertedHistory.push(convertedReply);
        }
        return convertedHistory;
    }
    this.getTextResponse = async function(modelName, prompt, options = {}) {
        this.modelExists(modelName);
        let client = await this.getSDKClient();
        const response = await client.responses.create({
            model: modelName,
            input: prompt
        });
        return response.output[0].content[0].text;
    }

    this.getTextStreamingResponse = function (modelName, prompt, options = {}, onDataChunk) {
        this.modelExists(modelName);
        //call openai lib
    }

    this.getChatCompletionResponse = async function(modelName, chatHistory, options = {}) {
        this.modelExists(modelName);
        let client = await this.getSDKClient();
        let convertedHistory = this.convertHistory(chatHistory)
        const response = await client.chat.completions.create({
            model: modelName,
            messages: convertedHistory
        });
        return response.choices[0].message.content;
    }

    this.getChatCompletionStreamingResponse = function(modelName, messages, options = {}, onDataChunk) {
        this.modelExists(modelName);
        //call openai lib
    }
}
module.exports = new OpenAI();