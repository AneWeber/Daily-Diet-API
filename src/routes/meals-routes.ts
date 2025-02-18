import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middleware/check-session_id-exists'

export async function mealsRoutes(app: FastifyInstance) {

  //creating a new meal
  app.post('/new-meal', 
    {
     preHandler: [checkSessionIdExists], 
    }, 
    async (request, reply) => {

    const createNewMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })
    
    const {name, description, isOnDiet, date} = createNewMealBodySchema.parse(
      request.body
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime(),
      user_id: request.user?.id,
    })

    return reply.status(201).send()
  })

  //selecting all meals from one user
  app.get('/', 
    { 
    preHandler: [checkSessionIdExists], 
    },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({user_id: request.user?.id})
        .orderBy('date', 'desc')

      return reply.send({ meals })
  })
  
  //selecting a specific meal
  app.get('/:mealId', 
    { 
      preHandler: [checkSessionIdExists], 
    }, 
    async (request, reply) => {
    const paramsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { mealId } = paramsSchema.parse(request.params)

    const meal = await knex('meals').where({id: mealId}).first()

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found'})
    }

    return reply.send({ meal })
  })

  //put
  //delete
  //get metrics
}