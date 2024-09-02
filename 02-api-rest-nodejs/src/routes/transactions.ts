import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { stat } from "node:fs";

export async function transactionsRoutes(app: FastifyInstance) {
	app.post("/create", async (request, response) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.string(),
		});

		const { title, amount, type } = createTransactionBodySchema.parse(
			request.body,
		);

		await knex("transactions").insert({
			id: randomUUID(),
			title: title,
			amount: type === "credit" ? amount : amount * -1,
			created_at: new Date(),
			session_id: randomUUID(),
		});

		response.status(201).send({ status: "success" });
	});

	app.get("/:id", async (request, response) => {
		const getTransactionParamsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = getTransactionParamsSchema.parse(request.params);

		const transaction = await knex("transactions")
			.select("*")
			.where({ id })
			.first();

		if (!transaction) {
			response.status(404).send({ status: "not found" });
		}

		return transaction;
	});

	app.get("/", async () => {
		const transaction = await knex("transactions").select("*");
		return { transaction };
	});

	app.get("/summary", async () => {
		const summary = await knex("transactions")
			.sum("amount", {
				as: "total",
			})
			.first();

		return { summary };
	});
}
