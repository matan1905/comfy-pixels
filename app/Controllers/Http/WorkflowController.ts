// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Workflow from "App/Models/Workflow";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Ws from "App/Services/Ws";
import {v4 as uuidv4} from 'uuid'

export default class WorkflowController {
  async create({ request, response }: HttpContextContract) {
    const { name, description, is_public, args } = request.body()
    let workflow = new Workflow()
    // Validating that args is an array of expected args with name and type
    if(!Array.isArray(args)) {
      throw new Error("Args must be an array")
    }
    for(const arg of args) {
      if(!arg.name || !arg.type || (arg.name==='select' && !arg.options)) {
        throw new Error("Invalid args")
      }
    }

    workflow.fill({ name, description, isPublic:is_public==='on', args: JSON.stringify(args), });
    workflow =await  workflow.save();
    response.redirect().toPath(`/workflow/manage/${workflow.secret}`)
  }
  new({view}){
    return view.render('workflow/new-workflow')
  }

  async home({view}){
    const workflows =await Workflow
      .query()
      .where('is_public', true)
      .orderBy('last_live_at', 'desc')
      .limit(128)
      .exec()
    return view.render('home', {workflows})
  }
  async manage({view, request}){
    const secret = request.param('secret')
    const workflow = await Workflow.findByOrFail('secret',secret)
    return view.render('workflow/manage-workflow', {workflow})
  }

  async generate({view,request}){
    const id = request.param('id')
    const workflow = await Workflow.findOrFail(id)
    return view.render('workflow/workflow-generate', {workflow})
  }

  async run({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const requestId = request.body().sessionId
    const args = request.body().args
    const workflow = await Workflow.findOrFail(id)
    try{
      Ws.runWorkflow(workflow.secret,requestId, args)
    }
    catch (e) {
      response.status(503).send(e.message)
    }

  }
}
