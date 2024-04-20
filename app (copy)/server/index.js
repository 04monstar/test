const app = require('express')();
const server = require('http').createServer(app)
const cors = require('cors');
const { Socket } = require('socket.io');
require('dotenv').config()



const io = require('socket.io')(server,{
    cors: {
        origin: "*",
          methods: ["GET", "POST"],
    }
});
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/',(req,res) =>{
    res.send(`server is on frontend`)
})

    // socket function
    io.on('connection',(Socket) =>{
        Socket.emit('me', Socket.id);
        Socket.on('disconnect',() =>{
            Socket.broadcast.emit('callended');
        })
        Socket.on('calluser', ({userTOCall, singalData, from,name}) =>{
            io.to(userTOCall).emit('calluser',{signal:singalData, from, name})
        })
        Socket.on('answercall',(data) =>{
            io.to(data.to).emit('callaccepted', data.signal);
        })
    })

server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})