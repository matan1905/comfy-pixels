import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["options"]



  changedType(e){
    const type = e.target.value;
    const options = this.optionsTarget;
    if(type === "select"){
      options.classList.remove("hidden");
    }else{
      options.classList.add("hidden");
    }
  }
}
