#!/usr/bin/env node

const { Command } = require('commander')
const { HfInference } = require('@huggingface/inference')

const hfCmd = new Command()

const addCommonOptions = (cmd) =>
    cmd
        .option('-k, --key <apiKey>')
        .requiredOption('-m, --model <model>')
        .requiredOption('-p, --prompt <prompt>')
        .option('--temperature <temperature>', parseFloat)
        .option('--top_p <top_p>', parseFloat)
        .option('--repetition_penalty <repetition_penalty>', parseFloat)
        .option('--max_tokens <max_tokens>', parseInt)

hfCmd
    .command('generateText')
    .description('Use text-generation endpoint')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'text'
        actionCommand.stream = false
    })
    .action(handleText)

hfCmd
    .command('generateTextStreaming')
    .description('Use text-generation endpoint with streaming')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'text'
        actionCommand.stream = true
    })
    .action(handleText)

hfCmd
    .command('getChatCompletion')
    .description('Use chat-completion endpoint')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'chat'
        actionCommand.stream = false
    })
    .action(handleChat)

hfCmd
    .command('getChatCompletionStreaming')
    .description('Use chat-completion endpoint with streaming')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'chat'
        actionCommand.stream = true
    })
    .action(handleChat)

addCommonOptions(hfCmd.commands[0])
addCommonOptions(hfCmd.commands[1])
addCommonOptions(hfCmd.commands[2])
addCommonOptions(hfCmd.commands[3])

async function handleText(opts, cmd) {
    const apiKey = opts.key || process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
        console.error('Error: Hugging Face API key not provided. Use --key option or set HUGGINGFACE_API_KEY environment variable.');
        process.exit(1);
    }

    const hf = new HfInference(apiKey)

    const parameters = {
        temperature: opts.temperature,
        top_p: opts.top_p,
        max_new_tokens: opts.max_tokens,
        repetition_penalty: opts.repetition_penalty
    }

    try {
        if (cmd.stream) {
            const stream = hf.textGenerationStream({
                model: opts.model,
                inputs: opts.prompt,
                parameters
            })
            for await (const chunk of stream) {
                process.stdout.write(chunk.token?.text || '')
            }
        } else {
            const result = await hf.textGeneration({
                model: opts.model,
                inputs: opts.prompt,
                parameters
            })
            process.stdout.write(result.generated_text || '')
        }
    } catch (err) {
        process.stderr.write(`\nERROR: ${err.message}\n`)
        process.exit(1)
    }
}

async function handleChat(opts, cmd) {
    const hf = new HfInference(opts.key)

    let messages
    try {
        messages = JSON.parse(opts.prompt)
        if (!Array.isArray(messages)) throw new Error()
    } catch {
        messages = [{ role: 'user', content: opts.prompt }]
    }

    const parameters = {
        temperature: opts.temperature,
        top_p: opts.top_p,
        max_new_tokens: opts.max_tokens,
        repetition_penalty: opts.repetition_penalty
    }

    try {
        if (cmd.stream) {
            const stream = hf.chatCompletionStream({
                model: opts.model,
                messages,
                parameters
            })
            for await (const chunk of stream) {
                process.stdout.write(chunk.choices?.[0]?.delta?.content || '')
            }
        } else {
            const result = await hf.chatCompletion({
                model: opts.model,
                messages,
                parameters
            })
            process.stdout.write(result.choices?.[0]?.message?.content || '')
        }
    } catch (err) {
        process.stderr.write(`\nERROR: ${err.message}\n`)
        process.exit(1)
    }
}

hfCmd.parse(process.argv)
