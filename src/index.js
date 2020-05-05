// const app=require('./app')
const express=require('express')
const http=require('http')
const path=require('path')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

const app=express()
const server=http.createServer(app)//BEHIND THE SCENE EXPRESS DID THE SAME THING..
const io=socketio(server)

//EXPRESS WILL USE THIS DIRECTORY FOR STATIC FILES..
const publicDirectory=path.join(__dirname,'../public')
app.use(express.static(publicDirectory))

io.on('connection',(socket)=>{
    console.log('New websocket connection')
    
    

    
    socket.on('join',(details,ack)=>{
        const user=addUser({id:socket.id,...details})
        if(user.error){
            return ack(user.error)
        }
        
        socket.join(user.room)
        socket.emit('message',generateMessage('Welcome!','Admin(Dhruv kumar)'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`,'Admin(Dhruv kumar)'))//TO AL USER EXCEPT THIS CONNECTED USER

        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })

    socket.on('sendMessage',(message,room,ack)=>{
        const filter=new Filter()

        if(filter.isProfane(message)){
            return ack('Message doesnot delevered')
        }

        const user=getUser(socket.id)

        io.to(user.room).emit('message',generateMessage(message,user.username))
        ack()
    })

    socket.on('sendLocation',(position,ack)=>{
        // io.emit('message',`Location:${position.latitude},${position.longitude}`)

        const user=getUser(socket.id)

        io.to(user.room).emit('locationMessage',generateLocationMessage(position,user.username))
        ack()
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} left the chap box..`,'Admin(Dhruv kumar)'))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        

        
    })

})

const portno=process.env.PORT || 3000
server.listen(portno,()=>{
    console.log(`Server is up on port ${portno}`)
})