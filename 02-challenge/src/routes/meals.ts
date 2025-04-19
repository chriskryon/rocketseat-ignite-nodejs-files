import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { checkUserIdExists } from '../middlewares/check-session-id-exists';

export async function mealsRoutes(app: FastifyInstance) {
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

    await knex('meals').insert({
      id: randomUUID(),
      user_id: userId,
      name,
      description,
      datetime,
      is_diet: isDiet,
    });

    return reply.status(201).send();
  });
}
