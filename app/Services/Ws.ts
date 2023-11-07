import { WebSocketServer } from 'ws';
import AdonisServer from '@ioc:Adonis/Core/Server'
import Workflow from "App/Models/Workflow";

class Ws {
  public wss: WebSocketServer
  private booted = false
  public servers = {}
  public sessions = {}
  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.wss = new WebSocketServer({server:AdonisServer.instance!})
    Workflow.query().where('is_live', true).update({isLive:false}).exec();
  }

  public runWorkflow(secret: string, requestId: string, args: any){
    if(this.servers[secret]) {
      this.servers[secret].send(JSON.stringify({
       ...args,
        _requestId:requestId
      }))
    } else throw new Error("Workflow offline")

  }

}

export default new Ws()
