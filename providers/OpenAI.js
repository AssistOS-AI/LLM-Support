function OpenAI(){
    this.name = "OpenAI";
    this.models = [
        {
            name: "gpt-3.5-turbo",
            type: "chat",
            provider: "OpenAi",
            description: "GPT-3.5 Turbo model for chat completions",
            capabilities: "",
            pricing: "",
            contextWindow: "",
            knowledgeCutoff: ""
        },
        {
            name: "gpt-4",
            type: "chat",
            provider: "OpenAi",
            description: "GPT-4 model for chat completions",
            capabilities: "",
            pricing: "",
            contextWindow: "",
            knowledgeCutoff: ""
        },
        {
            name: "text-davinci-003",
            type: "text",
            provider: "OpenAi",
            description: "Text generation model based on Davinci architecture",
            capabilities: "",
            pricing: "",
            contextWindow: "",
            knowledgeCutoff: ""
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