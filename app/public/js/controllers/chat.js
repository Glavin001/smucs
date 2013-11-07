var socket = io.connect('/');
$(document).ready( function() {
	var $chat = $(".chat");
	var $history = $("ul", $chat);
	var $form = $(".form", $chat);
	var $input = $("input", $form);
	var $scroll = $(".scroll-view", $chat);
	var $header = $(".header-bar", $chat);
	var $sendBtn = $(".send-btn", $form);
	var $minBtn = $(".minimize-btn", $chat);
	
	//console.log($history);
	socket.on('sendChat', function (data) {
		console.log(data);
		data.color = data.color || "#000";
		// Display it
		var $n = $("<li/>")
			.append( $("<strong/>",{'class':'user', 'style':"color:"+data.color+";"}).html(data.name + ": ") )
			.append( $("<span/>",{'class':'msg'}).html(data.msg) );
		$history.append($n);
		// Auto scroll to last message
		$scroll.scrollTop( $history.height() );

	});

	function sendMsg() {
		// Get message
		var msg = $input.val();
		$input.val("");
		if (msg !== "") // Check if empty
		{
			var data = { "name" : "User", "msg" : msg };
			socket.emit('sendChat', data);
		}
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

	// Maximize and Minimize
	$minBtn.click(function(event) {
		//console.log("Toggle")
		if ( $chat.hasClass("closed") ) {
			// Already closed
			// Then open it
			$chat.removeClass("closed");
			// Display new message
			$minBtn.html("&#8595; Minimize");			
		} else {
			// Currently Open
			// Then close it
			$chat.addClass("closed");
			// Display new message
			$minBtn.html("&#8593; Maximize");
		}
	});

});