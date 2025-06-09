import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {

  //creating user
  app.post('/', async (request, reply) => {
    const createNewUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      birthday: z.string()
    })
    
    const {name, email, birthday} = createNewUserBodySchema.parse(
      request.body
    )

    const userByEmail = await knex('users').where({ email }).first()
    
    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    const sessionId = randomUUID()

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      birthday,
      session_id: sessionId
    })

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 30 * 24 * 7, //7days
    })
      
    return reply.status(201).send()
  })
}