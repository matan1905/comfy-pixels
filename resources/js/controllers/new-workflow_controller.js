import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["args","argList","argTemplate"]
  addArg(e)
  {
    const arg = this.argTemplateTarget.content.cloneNode(true);
    this.argListTarget.appendChild(arg);
  }

  connect() {
    if(window.workflow){
      window.workflow.args.forEach(arg => {
        const argNode = this.argTemplateTarget.content.cloneNode(true);
        argNode.querySelector("[data-key='name']").value = arg.name;
        argNode.querySelector("[data-key='type']").value = arg.type;
        argNode.querySelector("[data-key='options']").value = arg.options;
        this.argListTarget.appendChild(argNode);
      });
    }
  }

  removeArg(e)
  {
    const arg = e.target.parentElement
    arg.remove();
  }


  submit(e){
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const args = []
    this.argsTargets.forEach(item => {
      const name = item.querySelector("[data-key='name']").value;
      const type = item.querySelector("[data-key='type']").value;
      const options = item.querySelector("[data-key='options']").value;
      args.push({ name, type,options});
    });

    const url = window.workflow? `/workflow/update/${window.workflow.secret}` : '/workflow/create';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.get('name'),
        description: data.get('description'),
        is_public: data.get('is_public'),
        args }),
    }).then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    })


  }
}
