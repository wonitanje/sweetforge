const port = process.env.port || 3000
export const server_url = (process.env.NODE_ENV !== 'production') ? `${location.protocol}//${location.hostname}:${port}` : ''
console.log('env', process.env.NODE_ENV, server_url)