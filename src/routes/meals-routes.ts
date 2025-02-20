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
  //add count, add count is on diet
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

  //Getting all the metrics
  app.get('/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const totalMealsOnDiet = await knex('meals')
        .where({ user_id: request.user?.id, is_on_diet: true })
        .count('id', { as: 'total' })
        .first()

      const totalMealsOffDiet = await knex('meals')
        .where({ user_id: request.user?.id, is_on_diet: false })
        .count('id', { as: 'total' })
        .first()

      const totalMeals = await knex('meals')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      const { bestOnDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return reply.send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet: totalMealsOnDiet?.total,
        totalMealsOffDiet: totalMealsOffDiet?.total,
        bestOnDietSequence,
      })
    },
  )

  //updating info from one specific meal
  app.put('/:mealId', 
    {
     preHandler: [checkSessionIdExists], 
    }, 
    async (request, reply) => {
      const paramsSchema = z.object({
        mealId: z.string().uuid(),
      })
  
      const { mealId } = paramsSchema.parse(request.params)
  
      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })
      
      const {name, description, isOnDiet, date} = updateMealBodySchema.parse(
        request.body
      )
      
      const meal = await knex('meals').where({id: mealId}).first()
      
      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found'})
      }

      await knex('meals').where({id: mealId}).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime()
      })

      return reply.status(204).send()
  })

  //deleting a meal
  app.delete('/:mealId', 
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

    await knex('meals').where({id: mealId}).delete()

    return reply.status(204).send()
  })

}