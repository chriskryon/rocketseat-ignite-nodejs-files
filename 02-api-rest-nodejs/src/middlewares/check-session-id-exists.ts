import type { FastifyRequest, FastifyReply } from 'fastify';

export async function checkSessionIdExists(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    response.status(401).send({ status: 'Unauthorized' });
  }
}
