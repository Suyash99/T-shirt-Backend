const runningEnv = () => {
    return process.env['RUNNING_ENV'] || 'DEVELOPMENT'
}

module.exports = {runningEnv}