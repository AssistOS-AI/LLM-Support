function OpenRouter(){
    this.name = "OpenRouter";
    this.models = [
        {
            modelName: "claude-3.5-sonnet",
            type: "chat",
            description: "Most intelligent Claude model, best for complex tasks",
            capabilities: ["completion"],
            pricing: {
                "input": "3",
                "output": "15"
            },
            contextWindow: 200000,
            knowledgeCutoff: "2024-04"
        },
        {
            modelName: "gpt-4o",
            type: "chat",
            description: "OpenAI's flagship multimodal model",
            capabilities: ["completion"],
            pricing: {
                "input": "5",
                "output": "15"
            },
            contextWindow: 128000,
            knowledgeCutoff: "2023-10"
        },
        {
            modelName: "claude-3-opus",
            type: "chat",
            description: "Most capable Claude model for complex analysis",
            capabilities: ["completion"],
            pricing: {
                "input": "15",
                "output": "75"
            },
            contextWindow: 200000,
            knowledgeCutoff: "2024-04"
        },
        {
            modelName: "llama-3.1-70b-instruct",
            type: "chat",
            description: "Open source model from Meta, good balance of performance",
            capabilities: ["completion"],
            pricing: {
                "input": "0.59",
                "output": "0.79"
            },
            contextWindow: 131072,
            knowledgeCutoff: "2024-07"
        },
        {
            modelName: "gemini-pro-1.5",
            type: "chat",
            description: "Google's multimodal model with large context window",
            capabilities: ["completion"],
            pricing: {
                "input": "2.5",
                "output": "10"
            },
            contextWindow: 1000000,
            knowledgeCutoff: "2024-04"
        },
        {
            modelName: "mistral-large",
            type: "chat",
            description: "Mistral's flagship model with strong multilingual support",
            capabilities: ["completion"],
            pricing: {
                "input": "3",
                "output": "9"
            },
            contextWindow: 128000,
            knowledgeCutoff: "2024-07"
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
                baseURL:"https://openrouter.ai/api/v1",
                apiKey: process.env.OPENAI_API_KEY
            });
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

}
module.exports = new OpenRouter();