const express = require('express');
const app = express();
var path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http,{
  path: '/myownpath'
});


app.use(express.static(path.join(__dirname, '../client')));

var numUsers = 0;
var usersName = []
// io.of('/chat')
io.on('connection', (socket) => {
  var addedUser = false;

  socket.on('add user',(username)=>{
    console.log('-------add user----------------------------------------------------------------')
    console.log(username)

    if (addedUser) return;
    console.log(addedUser)

    if(usersName.includes(username)){
      socket.emit('valid name', {
        result: false,
        type: 'repeat'
      });
      return
    }

    socket.emit('valid name', {
      result: true
    });

    usersName.push(username)
    socket.username = username
    ++numUsers
    addedUser = true;
    //只发送给当前客户端
    socket.emit('login', {
      numUsers: numUsers
    });
    //发送给除当前客户端外的所有客户端
    socket.broadcast.emit('user joined',{
      username: socket.username,
      numUsers: numUsers
    })
  })

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    console.log('-------typing-----------------------------------------------------------------')
    // console.log(socket)

    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    console.log('-------stop typing-----------------------------------------------------------------')
    // console.log(socket)

    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  socket.on('new message', (data) => {
    console.log('-------new message-----------------------------------------------------------------')
    console.log(data)
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    console.log('-------disconnect-----------------------------------------------------------------')
    console.log(socket.username,addedUser)

    if (addedUser) {
      --numUsers;
      usersName = usersName.filter(name=>name!==socket.username)

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});


http.listen(3004, function(){
  console.log('listening on *:3004');
});