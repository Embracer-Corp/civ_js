const EventEmiter = require('events')

const emitter = new EventEmiter()

emitter.on('anithing', data => {
    console.log('ON: anithing', data)
})

emitter.emit('anithing', {a: 1})

setTimeout(() => {
    emitter.emit('anithing', {c: 3})
}, 1500)