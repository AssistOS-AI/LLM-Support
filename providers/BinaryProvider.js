import binaryUtils from '../binaries/utils.js'

function BinaryProvider() {
    this.name = 'BinaryProvider';
    this.models = [];

    this.getModels = function() {
        return this.models
    }

    this.getTextResponse = async function(model, prompt, options = {}) {
        if (!this.models[model]) throw new Error(`Provider ${this.name} does not support model ${model}`)
        const args = binaryUtils.buildArgs('generateText', model, prompt, options)
        const binariesPath = binaryUtils.composeBinaryPath(this.name)
        return await binaryUtils.executeBinary(this.name, binariesPath, args)
    }

    this.getTextStreamingResponse = async function(model, prompt, options = {}, onDataChunk) {
        if (!this.models[model]) throw new Error(`Provider ${this.name} does not support model ${model}`)
        const args = binaryUtils.buildArgs(
            'generateTextStreaming',
            model,
            prompt,
            options,
            true)
        const binariesPath = binaryUtils.composeBinaryPath(this.name)
        return await binaryUtils.executeBinaryStreaming(this.name, binariesPath, args, onDataChunk)
    }

    this.getChatCompletionResponse = async function(model, messages, options = {}) {
        if (!this.models[model]) throw new Error(`Provider ${this.name} does not support model ${model}`)
        const args = binaryUtils.buildArgs('getChatCompletion', model, messages, options )
        const binariesPath = binaryUtils.composeBinaryPath(this.name)
        return await binaryUtils.executeBinary(this.name, binariesPath, args)
    }

    this.getChatCompletionStreamingResponse = async function(model, messages, options = {}, onDataChunk) {
        if (!this.models[model]) throw new Error(`Provider ${this.name} does not support model ${model}`)
        const args = binaryUtils.buildArgs(
            'getChatCompletionStreaming',
            model,
            messages,
            options,
            true,
        )
        const binariesPath = binaryUtils.composeBinaryPath(this.name)
        return await binaryUtils.executeBinaryStreaming(this.name, binariesPath, args, onDataChunk)
    }
}

module.exports = new BinaryProvider();
