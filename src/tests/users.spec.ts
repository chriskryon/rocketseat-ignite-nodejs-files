import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
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

  it('should be able to create a new user', async () => {
    const uniqueEmail = `john.doe+${Date.now()}@example.com`;

    const user = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: uniqueEmail,
      })
      .expect(201);

    console.log(user.body);
  });
});
