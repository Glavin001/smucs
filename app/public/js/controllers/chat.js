$(document).ready( function() {
	var $chat = $(".chat");
	var $history = $("ul", $chat);
	var $form = $(".form", $chat);
	var $input = $("input", $form);
	var $sendBtn = $(".send-btn", $form);
	
	//console.log($history);
	var socket = io.connect('/');
	socket.on('sendChat', function (data) {
		console.log(data);
		// Display it
		var $n = $("<li/>")
			.append( $("<span/>",{'class':'user'}).html(data.name + ": ") )
			.append( $("<span/>",{'class':'msg'}).html(data.msg) );
		$history.append($n);
	});

	function sendMsg() {
		// Get message
		var msg = $input.val();
		$input.val("");
		var data = { "name" : "User", "msg" : msg };
		socket.emit('sendChat', data);
	};

	$sendBtn.on("click", function(event) {
		sendMsg();
	});

	$input.keypress(function(event) {
		if (event.which === 13 )// Pressed Enter key 
		{
			sendMsg();
		}
	});

});