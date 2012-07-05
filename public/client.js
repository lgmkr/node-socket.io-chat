var strings = {
      'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
      'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
      'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
      'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
      'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
};

window.onload = function () {
  if (navigator.userAgent.toLowerCase().indexOf('chrome') != -1) {
    socket = io.connect('http://127.0.0.1:8000', {'transports': ['xhr-polling']});
  }
  else {
    socket = io.connect('http://127.0.0.1:8000');
  }
  socket.on('connect', function (){
    socket.on("message", function (msg) {
       document.querySelector('#log').innerHTML += strings[msg.event].replace(/\[([a-z]+)\]/g, '<span class="$1">').replace(/\[\/[a-z]+\]/g, '</span>').replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name).replace(/\%text\%/, unescape(msg.text).replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
       document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
    });

    document.querySelector('#input').onkeypress = function(e) {
      if (e.which == '13') {
        socket.send(escape(document.querySelector('#input').value));
        document.querySelector('#input').value = '';
      }
    };
  });
}

$(function () {
  $('input#nick').keypress(function(e){
    if (e.which == '13') {
      socket.emit('nickname', $('#nick').val(), function (set) {
        return $('#chat').addClass('nickname-set');
      });
    }
  });
  $('#set-nickname').submit(function (ev) {
    socket.emit('nickname', $('#nick').val(), function (set) {
      if (!set) {
        clear();
        return $('#chat').addClass('nickname-set');
      }
      $('#nickname-err').css('visibility', 'visible');
    });
    return false;
  });
})
