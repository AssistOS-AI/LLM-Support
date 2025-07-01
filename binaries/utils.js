const {spawn} = require('child_process');
const path = require('path');
async function executeBinary (binary,path, args = []){
    return new Promise((resolve, reject) => {
        //const proc = spawn(composeBinaryPath(binary), args)
        const proc = spawn('node', [path, ...args])
        let output = ''
        let errorOutput = ''

        proc.stdout.on('data', data => {
            output += data;
            console.log(`Output: ${data.toString().trim()}`)
        });
        proc.stderr.on('data', data => {errorOutput += data;
            console.error(`Error: ${data.toString().trim()}`)
        })

        proc.on('close', code => {
            if (code === 0) resolve(output.trim())
            else reject(new Error(errorOutput.trim()))
        })
    })
}
async function executeBinaryStreaming (binary, path,args = [], onDataChunk) {
    return new Promise((resolve, reject) => {
        const proc = spawn('node', [path, ...args])
        proc.stdout.on('data', data => onDataChunk(data.toString()))
        proc.stderr.on('data', data => reject(new Error(data.toString().trim())))

        proc.on('close', code => {
            if (code === 0) resolve()
        })
    })
}
function composeBinaryPath (binary) {
    return path.resolve(process.env.PERSISTENCE_FOLDER, `../binaries/${binary}.js`)
}

function buildArgs(subcommand, apiKey, model, promptOrMessages, options = {}, streaming = false) {
    const args = [subcommand, '-k', apiKey, '-m', model]
    if (typeof promptOrMessages === 'string') {
        args.push('-p', promptOrMessages)
    } else {
        args.push('-p', JSON.stringify(promptOrMessages))
    }

    if (streaming) args.push('--stream')
    if (options.temperature !== undefined) args.push('--temperature', options.temperature)
    if (options.top_p !== undefined) args.push('--top_p', options.top_p)
    if (options.frequency_penalty !== undefined) args.push('--frequency_penalty', options.frequency_penalty)
    if (options.presence_penalty !== undefined) args.push('--presence_penalty', options.presence_penalty)
    if (options.stop !== undefined) args.push('--stop', options.stop)
    if (options.max_tokens !== undefined) args.push('--max_tokens', options.max_tokens)
    return args;
}
module.exports = {
    executeBinary,
    executeBinaryStreaming,
    composeBinaryPath,
    buildArgs
}
