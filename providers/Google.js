function Google(){
    this.name = 'Google';
    this.models = [
        {
            name: "gemini-1.5-pro",
            type: "text",
            description: "Google’s most capable Gemini model with long context",
            capabilities: ["chat", "completion", "embeddings"],
            pricing: {
                "input": "7",
                "output": "21"
            },
            contextWindow: 1000000,
            knowledgeCutoff: "2024-08-01"
        },
        {
            name: "gemini-1.5-flash",
            type: "text",
            description: "Lightweight Gemini variant optimized for speed",
            capabilities: ["chat", "completion"],
            pricing: {
                "input": "1",
                "output": "3"
            },
            contextWindow: 1000000,
            knowledgeCutoff: "2024-08-01"
        }
    ];
}
module.exports = new Google();