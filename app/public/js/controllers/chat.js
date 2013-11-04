$(document).ready( function() {
	var $chat = $(".chat");
	var $history = $("ul", $chat);
	var $form = $(".form", $chat);
	var $input = $("input", $form);
	var $sendBtn = $(".send-btn", $form);
	
	//console.log($history);
	var socket = io.connect('http://localhost');
	socket.on('sendChat', function (data) {
		console.log(data);
		// Display it
		var $n = $("<li/>")
			.append( $("<span/>",{'class':'user'}).html(data.name + ": ") )
			.append( $("<span/>",{'class':'msg'}).html(data.msg) );
		$history.append($n);
	});

	$sendBtn.on("click", function(e) {
		console.log()
		// Get message
		var msg = $input.val();
		var data = { "name" : "User", "msg" : msg };
		socket.emit('sendChat', data);
	
	});

});