import fastify from 'fastify'
import knex from 'knex'
import { env } from './env'

const app = fastify()

app.get('/users', async () => {
  const users = await knex('users')

  return users
})

app.listen({
  port: env.PORT,
}).then(() => {
  console.log('HTTP Server Running!')
})