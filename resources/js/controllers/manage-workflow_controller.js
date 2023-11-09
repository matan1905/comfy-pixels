import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "wsLink" , "genLink", "embedCode"]
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

  copyGenerateLink(event) {
    event.preventDefault()
    navigator.clipboard.writeText(this.genLinkTarget.value)
    event.target.innerText = "Copied!"
    event.target.classList.add("text-red-300")
    event.target.classList.remove("text-red-500")
    setTimeout(() => {
      event.target.innerText = "Copy"
      event.target.classList.add("text-red-500")
      event.target.classList.remove("text-red-300")
    }, 1500)
  }

  copyEmbedCode(event) {
    event.preventDefault()
    navigator.clipboard.writeText(this.embedCodeTarget.value)
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
