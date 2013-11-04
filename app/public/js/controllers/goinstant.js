// GoInstant
function onLoad() {

  var url = 'https://goinstant.net/glavin001/SMUCS';
  var platform = new goinstant.Platform(url);
  platform.connect(function (err) {
    if (err) {
      console.log('Error connecting to platform:', err);
      return;
    }

    // 
    var room = platform.room('global');
    room.join(function (err) {
      if (err) {
        console.log('Error connecting to room:', err);
        return;
      }

      /*
      var nameKey = room.key('/name');
      var nameInput = document.getElementById('name');

      // handle sets from remote users
      nameKey.on('set', function(value, context) {
        nameInput.value = value;
      });

      // set the value when we load
      nameKey.get(function(err, value, context) {
        nameInput.value = value;
      });

      function setName() {
        setTimeout(function() {
          // set key to the new value
          nameKey.set(nameInput.value);
        }, 0);
      }

      nameInput.addEventListener('keyup', setName);
      nameInput.addEventListener('change', setName);
      */

      // Create a new instance of the UserList widget
      var userList = new goinstant.widgets.UserList({
        room: room,
        collapsed: false,
        position: 'right'
      });

      // Initialize the UserList widget
      userList.initialize(function(err) {
        if (err) {
          throw err;
        }
        // Now it should render on the page with any connected users
      });

      // Create a new instance of the UserColors widget
      var userColors = new goinstant.widgets.UserColors({ room: room });

      // Choose a color for the current user. If the user already has a color
      // assigned from a prior use of 'choose' then that existing color will be
      // returned.
      userColors.choose(function(err, color) {
        if (err) {
          throw err;
        }
        console.log('The chosen color is ' + color);
      });

    });


    /*
    // User List component
    goinstant.components.load('goinstant/v1/user-list', function(err, UserList) {

      var exampleRoom = platform.room('global');
      var options = {
        room: exampleRoom
      };

      var userList = new UserList(options);

      userList.initialize(function(err) {
        // ready
      });

    });

    // Load the notifications component
      goinstant.components.load('goinstant/v1/notifications', function(err, Notifications) {

        var exampleRoom = platform.room('exampleRoom');

        exampleRoom.join(function(err) {
          if (err) {
            console.log('Error joining room:', err);
            return;
          }

          // Create a new instance of the component
            var notifications = new Notifications();
            var exampleRoom = platform.room('exampleRoom');

            exampleRoom.join(function(err) {

              notifications.subscribe(exampleRoom, function(err) {
                // We're receiving notifications!
              });

              notifications.publish({
                room: exampleRoom,
                type: 'info',
                message: 'A new user has joined.'
              }, function(err) {
                // Notification sent
              });

            });
        });

    });
    */

  });
}

$(document).ready(function() {
  onLoad();
});