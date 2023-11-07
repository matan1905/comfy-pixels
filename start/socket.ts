import Ws from 'App/Services/Ws'
import Workflow from "App/Models/Workflow";
import url from "url";
import {DateTime} from "luxon";

Ws.boot()



Ws.wss.on("connection", async (ws,request) => {
  const urlWithParsedQuery = url.parse(request?.url || '', true)
  if(urlWithParsedQuery.pathname === '/serve' && urlWithParsedQuery.query?.secret) {
    const secret = urlWithParsedQuery.query.secret as string
    //   Update live to now
    const workflow = await Workflow.findBy('secret', secret)
      if(!workflow) {
        throw new Error("Workflow not found!")
      }
    workflow.lastLiveAt = DateTime.now()
    workflow.isLive = true
    await workflow.save()
    Ws.servers[secret] = ws
    ws.on("message", (message) => {
      try {
        const parsed = JSON.parse(message.toString())
        const reqWs = Ws.sessions[parsed._requestId]
        if(reqWs) {
          reqWs.send(message.toString())
        }
      } catch (e) {
        console.log("Error occurred when getting a message", e)
      }
    });

    ws.on('close', () => {
      // Update workflow to not live
      Workflow.findBy('secret', secret).then((workflow) => {
        workflow!.isLive = false
        workflow!.save()
      })
      delete Ws.servers[secret]

    })
  } else if (urlWithParsedQuery.pathname === '/session' && urlWithParsedQuery.query?.id) {
    const sessionId = urlWithParsedQuery.query.id as string
    Ws.sessions[sessionId] = ws
    ws.on('close', () => {
      delete Ws.sessions[sessionId]
    })
  }

});
