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
    
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 30 * 24 * 7, //7days
      })
    }

    const {name, email, birthday} = createNewUserBodySchema.parse(
      request.body
    )

    const userByEmail = await knex('users').where({ email }).first()

    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      birthday,
      session_id: sessionId
    })
    
    return reply.status(201).send()
  })
}