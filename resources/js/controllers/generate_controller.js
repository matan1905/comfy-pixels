import {Controller} from "@hotwired/stimulus"
import {v4 as uuidv4} from 'uuid';


export default class extends Controller {
  socket = null;
  static targets = ["output", "prompt", "args", "workflowId", 'generateButton']
  connect() {
    const sessionId = uuidv4();
    this.sessionId = sessionId;
    // Connect to websocket
    const socket = new WebSocket(`wss://${window.location.host}/session?id=${sessionId}`);
    socket.onmessage =  (event)=> {
      this.generateButtonTarget.disabled = false;
      this.generateButtonTarget.innerText = "Generate"
      const data = JSON.parse(event.data.toString());
      const base64_img = data.base64_img;
      const img = document.createElement('img');
      const a = document.createElement('a');
      a.href = `data:image/webp;base64,${base64_img}`;
      a.target = '_blank';
      img.src = `data:image/webp;base64,${base64_img}`;
      img.classList.add('object-cover','w-full', 'h-full')
      a.classList.add('h-32', 'w-32', 'inline','flex-shrink-0')
      a.appendChild(img)
      this.outputTarget.appendChild(a);
    }

    this.socket = socket;
    // Auto reconnect
    socket.onclose = (event) => {
        console.log('Connection died!');
        setTimeout(() => {
          this.connect();
        }, 1000);
    };
  }

  generate(e){
    e.preventDefault();
    this.generateButtonTarget.disabled = true;
    this.generateButtonTarget.innerText = "Generating..."

    const args = {}
    this.argsTargets.forEach(item => {
      const name = item.querySelector("[data-key='name']").attributes["data-value"].value
      const value = item.querySelector("[data-key='value']").value;
      if(value){
        args[name] = value
      }
    });

    args["prompt"] = this.promptTarget.value;

    fetch(`/workflow/run/${this.workflowIdTarget.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: this.sessionId,
        args }),
    }).then(response => {
      if(response.status === 503){
        window.location.reload();
      }

    })
  }

}
