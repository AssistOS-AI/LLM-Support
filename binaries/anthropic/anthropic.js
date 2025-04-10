#!/usr/bin/env node

const { Command } = require('commander')
const { Anthropic } = require('@anthropic-ai/sdk')

const anthropicCmd = new Command()

const addCommonOptions = (cmd) =>
    cmd
        .requiredOption('-k, --key <apiKey>')
        .requiredOption('-m, --model <model>')
        .requiredOption('-p, --prompt <prompt>')
        .option('--temperature <temperature>', parseFloat)
        .option('--top_p <top_p>', parseFloat)
        .option('--stop <stop>')
        .option('--max_tokens <max_tokens>', parseInt)

anthropicCmd
    .command('generateText')
    .description('Use Claude completion endpoint')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'completions'
        actionCommand.stream = false
    })
    .action(handleChat)

anthropicCmd
    .command('generateTextStreaming')
    .description('Use Claude completion with streaming')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'completions'
        actionCommand.stream = true
    })
    .action(handleChat)

anthropicCmd
    .command('getChatCompletion')
    .description('Use Claude chat interface (same as generateText)')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'chat'
        actionCommand.stream = false
    })
    .action(handleChat)

anthropicCmd
    .command('getChatCompletionStreaming')
    .description('Use Claude chat interface with stream')
    .hook('preAction', (thisCmd, actionCommand) => {
        actionCommand.endpoint = 'chat'
        actionCommand.stream = true
    })
    .action(handleChat)

addCommonOptions(anthropicCmd.commands[0])
addCommonOptions(anthropicCmd.commands[1])
addCommonOptions(anthropicCmd.commands[2])
addCommonOptions(anthropicCmd.commands[3])

async function handleChat(opts, cmd) {
    const anthropic = new Anthropic({ apiKey: opts.key })

    let messages
    try {
        messages = JSON.parse(opts.prompt)
        if (!Array.isArray(messages)) throw new Error()
    } catch {
        messages = [{ role: 'user', content: opts.prompt }]
    }

    const systemPrompt = messages.find(m => m.role === 'system')?.content
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content)
    const promptText = userMessages.join('\n\n')

    const config = {
        model: opts.model,
        max_tokens: opts.max_tokens ?? 1024,
        temperature: opts.temperature,
        top_p: opts.top_p,
        stop_sequences: opts.stop ? [opts.stop] : undefined,
        system: systemPrompt,
        messages: [
            { role: 'user', content: promptText }
        ]
    }

    try {
        if (cmd.stream) {
            const stream = anthropic.messages.stream(config)
            for await (const chunk of stream) {
                process.stdout.write(chunk?.delta?.text || '')
            }
        } else {
            const res = await anthropic.messages.create(config)
            process.stdout.write(res?.content?.[0]?.text || '')
        }
    } catch (err) {
        process.stderr.write(`\nERROR: ${err.message}\n`)
        process.exit(1)
    }
}

anthropicCmd.parse(process.argv)
