import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const { name, email } = createUserSchema.parse(request.body);

    let userId = request.cookies.userId;

    if (!userId) {
      userId = randomUUID();

      reply.setCookie('userId', userId, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      });
    }

    await knex('users').insert({
      id: userId,
      name,
      email,
    });

    return reply.status(201).send({ id: userId });
  });
}
