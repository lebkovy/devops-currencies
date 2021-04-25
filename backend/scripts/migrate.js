const db = require('../db')
const tableName = 'operations';

;(async () => {
  try {
    console.log('Setting up database...')
    await db.schema.dropTableIfExists(tableName)
    await db.schema.withSchema('public').createTable(tableName, (table) => {
      table.increments()
      table.integer('value')
      table.string('currency')
    })
    console.log(`Created ${tableName} table!`)
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
