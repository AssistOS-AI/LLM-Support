function OpenAI(){
    this.name = "OpenAI";
    this.models = []

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
module.exports = new OpenAI();