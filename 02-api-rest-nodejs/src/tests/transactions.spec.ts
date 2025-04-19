import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  test,
} from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { exec, execSync } from 'node:child_process';

describe('Transactions', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    console.log('Rolling back migrations...');
    execSync('npm run knex migrate:rollback --all');

    console.log('Running migrations...');
    execSync('npm run knex migrate:latest');
  });

  // e2e test - são poucos, mas são importantes para garantir que a aplicação funcione como um todo

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'teste 3',
        amount: 3000,
        type: 'credit',
      })
      .expect(201);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Nova transação',
        amount: 55000,
        type: 'credit',
      })
      .expect(201);

    const cookies = createTransactionResponse.get('Set-Cookie');

    console.log('Cookies:', cookies);

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies ?? [])
      .expect(200);

    console.log(listTransactionsResponse.body.transaction);

    expect(listTransactionsResponse.body.transaction).toEqual([
      expect.objectContaining({
        amount: 55000,
        title: 'Nova transação',
      }),
    ]);
  });

  it('should be able to list a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Nova transação',
        amount: 55000,
        type: 'credit',
      })
      .expect(201);

    const cookies = createTransactionResponse.get('Set-Cookie');

    console.log('Cookies:', cookies);

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies ?? [])
      .expect(200);

    const transactionId = listTransactionsResponse.body.transaction[0].id;
    console.log('Transaction ID:', transactionId);

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies ?? [])
      .expect(200);

    expect(getTransactionResponse.body).toEqual(
      expect.objectContaining({
        amount: 55000,
        title: 'Nova transação',
      }),
    );
  });
});
