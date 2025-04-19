import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { checkUserIdExists } from '../middlewares/check-session-id-exists';

export async function mealsRoutes(app: FastifyInstance) {
  // Deve ser possível registrar uma refeição feita pelo usuário
  app.post('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      datetime: z.string().datetime(),
      isDiet: z.boolean(),
    });

    const { name, description, datetime, isDiet } = createMealSchema.parse(
      request.body,
    );

    const userId = request.cookies.userId;

    const mealId = await knex('meals')
      .insert({
        id: randomUUID(),
        user_id: userId,
        name,
        description,
        datetime,
        is_diet: isDiet,
      })
      .returning('id');

    return reply.status(201).send({ mealId: mealId[0].id });
  });

  // Deve ser possível editar uma refeição, podendo alterar todos os dados
  app.put(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const updateMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        datetime: z.string().datetime(),
        isDiet: z.boolean(),
      });

      const { name, description, datetime, isDiet } = updateMealSchema.parse(
        request.body,
      );

      const { id } = request.params as { id: string };
      const userId = request.cookies.userId;

      const updatedRows = await knex('meals')
        .where({ id, user_id: userId })
        .update({
          name,
          description,
          datetime,
          is_diet: isDiet,
        })
        .first();

      if (updatedRows === 0) {
        return reply.status(404).send({ message: 'Meal not found' });
      }

      return reply.status(200).send();
    },
  );

  // Deve ser possível apagar uma refeição
  app.delete(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const userId = request.cookies.userId;

      const deletedRows = await knex('meals')
        .where({ id, user_id: userId })
        .delete();

      if (deletedRows === 0) {
        return reply.status(404).send({ message: 'Meal not found' });
      }

      return reply.status(204).send({ message: 'Meal deleted' });
    },
  );

  // Deve ser possível buscar uma refeição específica
  app.get(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const userId = request.cookies.userId;

      const meal = await knex('meals').where({ id, user_id: userId }).first();

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' });
      }

      return reply.status(200).send(meal);
    },
  );

  // Deve ser possível buscar todas as refeições de um usuário
  app.get('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const userId = request.cookies.userId;

    const meals = await knex('meals').where({ user_id: userId });

    if (!meals.length) {
      return reply.status(404).send({ message: 'No meals found' });
    }

    return reply.status(200).send(meals);
  });

  // Deve ser possível recuperar as métricas de um usuário
  app.get(
    '/metrics',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const userId = request.cookies.userId;

      const totalMeals = await knex('meals')
        .where({ user_id: userId })
        .count<{ count: number }>('* as count')
        .first();

      const totalDietMeals = await knex('meals')
        .where({ user_id: userId, is_diet: true })
        .count<{ count: number }>('* as count')
        .first();

      const totalNonDietMeals = await knex('meals')
        .where({ user_id: userId, is_diet: false })
        .count<{ count: number }>('* as count')
        .first();

      const meals = await knex('meals')
        .where({ user_id: userId })
        .orderBy('datetime', 'asc');

      let bestDietSequence = 0;
      let currentSequence = 0;

      for (const meal of meals) {
        if (meal.is_diet) {
          currentSequence++;
          if (currentSequence > bestDietSequence) {
            bestDietSequence = currentSequence;
          }
        } else {
          currentSequence = 0;
        }
      }

      return reply.status(200).send({
        totalMeals: totalMeals?.count,
        totalDietMeals: totalDietMeals?.count,
        totalNonDietMeals: totalNonDietMeals?.count,
        bestDietSequence,
      });
    },
  );
}
