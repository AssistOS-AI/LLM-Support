#!/usr/bin/env node
const { Command } = require('commander')
const axios = require('axios')

const googleCmd = new Command()

const addCommonOptions = (cmd) =>
    cmd
        .requiredOption('-k, --key <apiKey>')
        .requiredOption('-m, --model <model>')
        .requiredOption('-p, --prompt <prompt>')
        .option('--temperature <temperature>', parseFloat)
        .option('--top_p <top_p>', parseFloat)
        .option('--frequency_penalty <frequency_penalty>', parseFloat)
        .option('--presence_penalty <presence_penalty>', parseFloat)
        .option('--stop <stop>')
        .option('--max_tokens <max_tokens>', parseInt)

googleCmd
    .command('generateText')
    .description('Use Gemini text model (non-chat)')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'completions'
        actionCommand.stream = false
    })
    .action(handleText)

googleCmd
    .command('generateTextStreaming')
    .description('Streaming not supported (no-op fallback)')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'completions'
        actionCommand.stream = true
    })
    .action(handleText)

googleCmd
    .command('getChatCompletion')
    .description('Use Gemini chat model')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'chat'
        actionCommand.stream = false
    })
    .action(handleChat)

googleCmd
    .command('getChatCompletionStreaming')
    .description('Streaming not supported (fallback to non-streaming)')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'chat'
        actionCommand.stream = true
    })
    .action(handleChat)

addCommonOptions(googleCmd.commands[0])
addCommonOptions(googleCmd.commands[1])
addCommonOptions(googleCmd.commands[2])
addCommonOptions(googleCmd.commands[3])

async function handleText(opts, cmd) {
    process.stderr.write(`\n[WARN] Gemini does not support non-chat completions. Using chat fallback.\n`)
    await handleChat(opts, cmd)
}

async function handleChat(opts, cmd) {
    let messages
    try {
        messages = JSON.parse(opts.prompt)
        if (!Array.isArray(messages)) throw new Error()
    } catch {
        messages = [{ role: 'user', content: opts.prompt }]
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${opts.key}`

    const payload = {
        contents: messages.map(msg => ({
            role: msg.role === 'system' ? 'model' : msg.role,
            parts: [{ text: msg.content }]
        })),
        generationConfig: {
            temperature: opts.temperature,
            topP: opts.top_p,
            maxOutputTokens: opts.max_tokens,
            stopSequences: opts.stop ? [opts.stop] : undefined
        }
    }

    try {
        const res = await axios.post(url, payload)
        const content = res.data?.candidates?.[0]?.content?.parts?.[0]?.text
        process.stdout.write(content || '')
    } catch (err) {
        process.stderr.write(`\nERROR: ${err.response?.data?.error?.message || err.message}\n`)
        process.exit(1)
    }
}

googleCmd.parse(process.argv)
