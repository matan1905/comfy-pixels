import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import {beforeCreate} from "@adonisjs/lucid/build/src/Orm/Decorators";
export default class Workflow extends BaseModel {
  @column({ isPrimary: true,  })
  public id: string

  @column()
  public secret: string

  @column()
  public isLive: boolean

  @column.dateTime()
  public lastLiveAt: DateTime

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public isPublic: boolean

  @column()
  public args: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID (model: Workflow) {
    model.id = uuid()
    model.secret = uuid()
  }

  @beforeCreate()
  public static async setlastLiveAtToNever (model: Workflow) {
    model.lastLiveAt = DateTime.fromSeconds(0)
  }
}
