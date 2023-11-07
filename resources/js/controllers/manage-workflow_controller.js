import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "wsLink" ]
  copyLink(event) {
    event.preventDefault()
    navigator.clipboard.writeText(this.wsLinkTarget.value)
    event.target.innerText = "Copied!"
    event.target.classList.add("text-red-300")
    event.target.classList.remove("text-red-500")
    setTimeout(() => {
      event.target.innerText = "Copy"
      event.target.classList.add("text-red-500")
      event.target.classList.remove("text-red-300")
    }, 1500)
  }
}
