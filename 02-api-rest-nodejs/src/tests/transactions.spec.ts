import { afterAll, beforeAll, describe, it, test } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('Transactions', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('shoudl be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'teste 3',
        amount: 3000,
        type: 'credit',
      })
      .expect(201);
  });
});
