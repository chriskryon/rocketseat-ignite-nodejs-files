import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { execSync } from 'node:child_process';

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to create a new meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `john.doe+${Date.now()}@example.com`,
      })
      .expect(201);

    const cookies = userResponse.get('Set-Cookie');

    const mealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Breakfast',
        description: 'Eggs and toast',
        datetime: new Date().toISOString(),
        isDiet: true,
      })
      .expect(201);

    expect(mealResponse.body).toHaveProperty('mealId');
  });

  it('should be able to edit an existing meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `john.doe+${Date.now()}@example.com`,
      })
      .expect(201);

    const cookies = userResponse.get('Set-Cookie');

    const mealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Lunch',
        description: 'Grilled chicken and rice',
        datetime: new Date().toISOString(),
        isDiet: false,
      })
      .expect(201);

    const mealId = mealResponse.body.mealId;

    console.log(mealResponse.body);
    console.log('Meal ID:', mealId);

    const mealEdited = await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Updated Lunch',
        description: 'Grilled chicken, rice, and salad',
        datetime: new Date().toISOString(),
        isDiet: true,
      })
      .expect(200);

    console.log(mealEdited.body);

    const updatedMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies ?? [])
      .expect(200);

    expect(updatedMealResponse.body).toMatchObject({
      name: 'Updated Lunch',
      description: 'Grilled chicken, rice, and salad',
      is_diet: 1,
    });
  });

  it('should be able to delete a meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `john.doe+${Date.now()}@example.com`,
      })
      .expect(201);

    const cookies = userResponse.get('Set-Cookie');

    const mealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Dinner',
        description: 'Steak and potatoes',
        datetime: new Date().toISOString(),
        isDiet: false,
      })
      .expect(201);

    const mealId = mealResponse.body.mealId;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies ?? [])
      .expect(204);

    const deletedMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies ?? [])
      .expect(404);

    expect(deletedMealResponse.body).toMatchObject({
      message: 'Meal not found',
    });
  });

  it('should be able to fetch a specific meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `john.doe+${Date.now()}@example.com`,
      })
      .expect(201);

    const cookies = userResponse.get('Set-Cookie');

    const mealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Snack',
        description: 'Apple and peanut butter',
        datetime: new Date().toISOString(),
        isDiet: true,
      })
      .expect(201);

    const mealId = mealResponse.body.mealId;

    const fetchedMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies ?? [])
      .expect(200);

    expect(fetchedMealResponse.body).toMatchObject({
      name: 'Snack',
      description: 'Apple and peanut butter',
      is_diet: 1,
    });
  });

  it('should be able to fetch all meals for a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `john.doe+${Date.now()}@example.com`,
      })
      .expect(201);

    const cookies = userResponse.get('Set-Cookie');

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Breakfast',
        description: 'Eggs and toast',
        datetime: new Date().toISOString(),
        isDiet: true,
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Lunch',
        description: 'Grilled chicken and rice',
        datetime: new Date().toISOString(),
        isDiet: false,
      })
      .expect(201);

    const allMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies ?? [])
      .expect(200);

    expect(allMealsResponse.body).toHaveLength(2);
    expect(allMealsResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Breakfast' }),
        expect.objectContaining({ name: 'Lunch' }),
      ]),
    );
  });

  it('should be able to fetch user metrics', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `john.doe+${Date.now()}@example.com`,
      })
      .expect(201);

    const cookies = userResponse.get('Set-Cookie');

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Breakfast',
        description: 'Eggs and toast',
        datetime: new Date().toISOString(),
        isDiet: true,
      })
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Lunch',
        description: 'Grilled chicken and rice',
        datetime: new Date().toISOString(),
        isDiet: false,
      })
      .expect(201);

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies ?? [])
      .expect(200);

    expect(metricsResponse.body).toMatchObject({
      totalMeals: 2,
      totalDietMeals: 1,
      totalNonDietMeals: 1,
      bestDietSequence: 1,
    });
  });

  it("should not allow a user to edit another user's meal", async () => {
    const user1Response = await request(app.server)
      .post('/users')
      .send({
        name: 'User One',
        email: `user.one+${Date.now()}@example.com`,
      })
      .expect(201);

    const cookiesUser1 = user1Response.get('Set-Cookie');

    const mealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookiesUser1 ?? [])
      .send({
        name: 'Breakfast',
        description: 'Eggs and toast',
        datetime: new Date().toISOString(),
        isDiet: true,
      })
      .expect(201);

    const mealId = mealResponse.body.mealId;

    const user2Response = await request(app.server)
      .post('/users')
      .send({
        name: 'User Two',
        email: `user.two+${Date.now()}@example.com`,
      })
      .expect(201);

    const cookiesUser2 = user2Response.get('Set-Cookie');

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookiesUser2 ?? [])
      .send({
        name: 'Updated Breakfast',
        description: 'Updated description',
        datetime: new Date().toISOString(),
        isDiet: false,
      })
      .expect(404);
  });
});
