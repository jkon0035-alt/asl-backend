const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: '*' }
})

io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join-room', (roomId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-joined', socket.id)
        console.log(`User ${socket.id} joined room ${roomId}`)
    })

    socket.on('offer', (data) => {
        socket.to(data.roomId).emit('offer', data)
    })

    socket.on('answer', (data) => {
        socket.to(data.roomId).emit('answer', data)
    })

    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', data)
    })

    socket.on('word-detected', (data) => {
        socket.to(data.roomId).emit('word-detected', data)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
    })
})

server.listen(3001, () => {
    console.log('Signalling server running on port 3001')
})