import { afterAll, beforeAll, test } from "vitest";
import request from "supertest";
import { app } from "../app";

beforeAll(async () => {
	await app.ready();
});

afterAll(async () => {
	await app.close();
});

test("user can create a new transaction", async () => {
	await request(app.server)
		.post("/transactions")
		.send({
			title: "teste 3",
			amount: 3000,
			type: "credit",
		})
		.expect(201);
});
