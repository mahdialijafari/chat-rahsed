import { Server } from "socket.io";
import app from '../app.js'
import {createServer} from 'http'

const server=createServer(app)
const io = new Server(server,{
    cors:'*'
})
const onlineUser={}

const getSocketId=(item)=>{
    if(typeof item=='string'){
        return onlineUser[item]
    }else {
        const socketIds=[]
        item?.map(e=>{
            if(onlineUser[e]){
                socketIds.push(onlineUser[e])
            }
        })
        return socketIds
    }
    return null
}

io.on('connection',(socket)=>{
    const userId=socket.handshake.query.userId
    if(userId!='undefined'){
        onlineUser[userId]=socket.id
    }
    io.emit('getOnlineUser',Object.keys(onlineUser))

    socket.on('disconnect',()=>{
        delete onlineUser[userId]
        io.emit('getOnlineUser',Object.keys(onlineUser))
    })
})

export {getSocketId,server,io}