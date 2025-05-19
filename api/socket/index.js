import { Server } from "socket.io";
import app from '../app.js'
import {createServre} from 'http'

const server=createServre(app)
const io = new Server(server,{
    cors:'*'
})
export const onlineUser={}

const getSocketId=(item)=>{
    if(typeof item=='string'){
        return onlineUser[item]
    }else{
        const socketIds=[]
        item?.map(e=>{
            if(onlineUser[e]){
                socketIds.push(onlineUser[e])
            }
        })
        return socketIds
    }
}

io.on('connection',(socket)=>{
    const userId=socket.handshake.query.userId
    if(userId!='undefined'){
        onlineUser[userId]=socket.id
    }
    io.emit('getOnlineUser',Object.keys(onlineUser))

    socket.on('disconnect')
})