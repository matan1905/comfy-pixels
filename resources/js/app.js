import '../css/app.css'

import { Application } from "@hotwired/stimulus"
import { definitionsFromContext } from "@hotwired/stimulus-webpack-helpers"

window.Stimulus = Application.start()
const context = require.context("./controllers", true, /\.js$/)
Stimulus.load(definitionsFromContext(context))


function connectRequestSession(){
  // Connect to websocket
  const socket = new WebSocket('ws://localhost:8080');
  socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({type: 'request_session', session_id: sessionId}));
  });
  socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    if(data.type === 'session_created'){
      const session = data.session;
      const sessionEl = document.getElementById('session');
      sessionEl.innerHTML = session;
    }
  });


}
