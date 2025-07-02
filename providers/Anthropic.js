function Anthropic(){
    this.name = "Anthropic";
    this.models = [
        {
            name: "claude-3-opus",
            type: "text",
            description: "Anthropic’s most powerful Claude 3 model",
            capabilities: ["chat", "completion"],
            pricing: {
                "input": "15",
                "output": "75"
            },
            contextWindow: 200000,
            knowledgeCutoff: "2024-08-01"
        },
        {
            name: "claude-3-sonnet",
            type: "text",
            description: "Mid-range Claude 3 model with solid performance",
            capabilities: ["chat", "completion"],
            pricing: {
                "input": "3",
                "output": "15"
            },
            contextWindow: 200000,
            knowledgeCutoff: "2024-08-01"
        },
        {
            name: "claude-3-haiku",
            type: "text",
            description: "Fast and cheap Claude model for high-throughput tasks",
            capabilities: ["chat", "completion"],
            pricing: {
                "input": "0.25",
                "output": "1.25"
            },
            contextWindow: 200000,
            knowledgeCutoff: "2024-08-01"
        }
    ];
}
module.exports = new Anthropic();