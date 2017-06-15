var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
	res.writeHead(200, {"Content-type": "text/html"});
        res.end(content);
    });
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');

    socket.on('message', function(message) {
        var reponse = {
            pseudo: this.pseudo,
            date: getDate(),
            message: message
        };

        this.emit('reponse', reponse);
        this.broadcast.emit('reponse', reponse);
    });

    socket.on('inscription', function(pseudo) {
        socket.pseudo = pseudo;
        messageConnectionPerso = 'bienvenue sur le chat ' + pseudo;
        messageConnectionGeneral = pseudo + ' est entré sur le chat';
        this.emit('connection', messageConnectionPerso);
        this.broadcast.emit('connection', messageConnectionGeneral);
    });

    socket.on('quit', function() {
        messageConnectionGeneral = this.pseudo + ' a quitté le chat';
        this.broadcast.emit('connection', messageConnectionGeneral);
    });
});

function getDate(){
    var today = new Date();
    var ss = addZero(today.getSeconds());
    var mi = addZero(today.getMinutes());
    var hh = addZero(today.getHours());
    var dd = addZero(today.getDate());
    var mm = addZero(today.getMonth());
    var yyyy = today.getFullYear();

    return ' [' + yyyy + '/' + mm + '/' + dd + ' - ' + hh + ':' + mi + ':' + ss + '] ';

}

function addZero(value){
    if (value < 10){
        value = '0' + value;
    }

    return value;
}

server.listen(8080);
