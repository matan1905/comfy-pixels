import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'workflows'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').index().unique().notNullable()
      table.uuid('secret').unique().notNullable()
      table.boolean('is_live').defaultTo(false)
      table.timestamp('last_live_at', { useTz: true }).nullable()
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.boolean('is_public').defaultTo(false)
      table.json('args').nullable()


      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
