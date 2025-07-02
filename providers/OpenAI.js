function OpenAI(){
    this.name = "OpenAI";
    this.models = [
        {
            name: "gpt-4o",
            type: "text",
            description: "A cheap model specialized in text generation",
            capabilities: [
                "chat",
                "completion",
                "embeddings"
            ],
            pricing: {
                "input": "2.5",
                "output": "10"
            },
            contextWindow: 128000,
            knowledgeCutoff: "2024-08-06"
        },
        {
            name: "gpt-3.5-turbo",
            type: "text",
            description: "OpenAI's low-cost, high-speed text model",
            capabilities: ["chat", "completion"],
            pricing: {
                "input": "1",
                "output": "2"
            },
            contextWindow: 16385,
            knowledgeCutoff: "2023-09-01"
        },
        {
            name: "o1-preview",
            type: "text",
            description: "Experimental OpenAI model, optimized for preview tasks",
            capabilities: ["completion"],
            pricing: {
                "input": "2",
                "output": "6"
            },
            contextWindow: 128000,
            knowledgeCutoff: "2024-08-06"
        },
        {
            name: "o1-mini",
            type: "text",
            description: "Smaller variant of o1-preview for high-output generation",
            capabilities: ["completion"],
            pricing: {
                "input": "1.5",
                "output": "5"
            },
            contextWindow: 128000,
            knowledgeCutoff: "2024-08-06"
        },
        {
            provider: "OpenAI",
            name: "gpt-4",
            type: "text",
            description: "Previous flagship GPT-4 model",
            capabilities: ["chat", "completion", "embeddings"],
            pricing: {
                "input": "6",
                "output": "12"
            },
            contextWindow: 8192,
            knowledgeCutoff: "2023-09-01"
        }
    ]

    this.getModels = function (){
        return this.models;
    }
    this.modelExists = function (modelName){
        if (!this.models[modelName]) throw new Error(`Provider ${this.name} does not support model ${modelName}`)

    }
    this.getTextResponse = async function(modelName, prompt, options = {}) {
        this.modelExists(modelName);
        //call openai lib
    }

    this.getTextStreamingResponse = function (modelName, prompt, options = {}, onDataChunk) {
        this.modelExists(modelName);
        //call openai lib
    }

    this.getChatCompletionResponse = async function(modelName, messages, options = {}) {
        this.modelExists(modelName);
        //call openai lib
    }

    this.getChatCompletionStreamingResponse = function(modelName, messages, options = {}, onDataChunk) {
        this.modelExists(modelName);
        //call openai lib
    }
}
module.exports = new OpenAI();