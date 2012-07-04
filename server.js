var app = require('http').createServer(handler);
app.listen(8000);

var io = require('socket.io').listen(app),
    fs = require('fs'),
    static = require('node-static'),
    path = require('path');

var file = new static.Server(path.join('public'));

function handler(req, res) {
  file.serve(req, res);
}

io.sockets.on('connection', function(socket){
  var ID = (socket.id).toString().substr(0,5);
  var time = (new Date).toLocaleTimeString();

  socket.json.send({
                    'event': 'connected',
                    'name': ID,
                    'time': time
  });

  socket.broadcast.json.send({
                              'event': 'userJoined',
                              'name': ID,
                              'time': time
  });

  socket.on('message', function(msg){

    var time = (new Date).toLocaleTimeString();
    socket.json.send({
                      'event': 'messageSent',
                      'name': ID,
                      'text': msg,
                      'time': time});

    socket.broadcast.json.send({
                                'event': 'messageReceived',
                                'name': ID,
                                'text': msg,
                                'time': time});
  });

  socket.on('disconnect', function() {
    var time = (new Date).toLocaleTimeString();
    io.sockets.json.send({
                          'event': 'userSplit',
                          'name': ID,
                          'time': time});
  });

});
