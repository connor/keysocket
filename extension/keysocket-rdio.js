var PREV = 20;
var PLAY = 16;
var NEXT = 19;

var fake_prev_el = document.createElement('button');
fake_prev_el.id = "fake_prev_el";
fake_prev_el.style.height = 0;
fake_prev_el.style.width = 0;
document.body.appendChild(fake_prev_el);

var s = document.createElement('script')
s.src = chrome.extension.getURL("rdio-prev.js")
document.head.appendChild(s);

function simulateClick(selector) {
  var evt = document.createEvent('MouseEvents');
  evt.initMouseEvent('click', true, false,  document, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  document.querySelector(selector).dispatchEvent(evt);
}

var connection = null;
var isConnected = false;

function connect() {
  // Connect to a websocket server
  connection = new WebSocket('ws://localhost:1337/');

  // When the connection is open, send some data to the server
  connection.onopen = function() {
    console.log('WS open');
    isConnected = true;
    connection.send('Ping'); // Send the message 'Ping' to the server


    // Log errors
    connection.onerror = function(error) {
      console.log('WS error', error);
    };

    // Log messages from the server
    connection.onmessage = function(e) {
      console.log('WS message', e);
      var key = e.data;
      if (key == PREV) {
        simulateClick("#fake_prev_el")
      } else if (key == NEXT) {
        simulateClick('.left_controls .next');
      } else if (key == PLAY) {
        simulateClick('.left_controls .play_pause');
      }
    };

    connection.onclose = function(e) {
      console.log('WS close', e);
      isConnected = false;
      reconnect();
    };
  };

}

function reconnect() {
  // If we're not connected,
  if (!isConnected) {
    // Attempt to connect.
    connect();
    // Then ensure we're connected.
    setTimeout(reconnect, 1000);
  }
}

reconnect();
