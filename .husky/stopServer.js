cp = require('node:child_process')
const kill = require('kill-port')
const PORT = 8080

kill(PORT, 'tcp')
  .then(() => {
    console.log('successfully terminate vite server')
  })
  .catch((e) => {
    console.error(e)
  })
