import { knex as setupKnex } from 'knex'

export const config = setupKnex({
  client: 'sqlite',
  connection: {
    filename: './tmp/app.db',
  },
})