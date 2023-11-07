const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Socket } = require('dgram')
const formatMessage = require('./utils/messages')
const { userJoin, userLeave, getRoomUser, getCurrentUser } = require('./utils/users')

const app = express()

const server = http.createServer(app)


const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))




// Connecting client
io.on('connection', socket => {


    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        socket.emit('message', formatMessage(`${user.username} `, 'Welcome to ChatCord'))


        // Broadcast when a user connects

        socket.broadcast.to(user.room).emit('message', formatMessage('chat ', `${username} has joined the chat`))


        // users and room information

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUser(user.room)
        })

    })




    // listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // When client disconnect
    socket.on('disconnect', () => {

        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(`${user.username}`, `A ${user.username} has left the chat`))

            // users and room information

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUser(user.room)
            })
        }

    })









})
const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`server running on port ${PORT}`))
