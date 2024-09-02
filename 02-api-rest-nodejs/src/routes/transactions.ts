import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { request } from "node:http";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

// Cookies <-> formas de manter contexto entre requisições

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

		let sessionId = request.cookies.sessionId;

		if (!sessionId) {
			sessionId = randomUUID();
			response.cookie("sessionId", sessionId, {
				path: "/",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});
		}

		await knex("transactions").insert({
			id: randomUUID(),
			title: title,
			amount: type === "credit" ? amount : amount * -1,
			created_at: new Date(),
			session_id: sessionId,
		});

		response.status(201).send({ status: "success" });
	});

	app.get(
		"/:id",
		{ preHandler: [checkSessionIdExists] },
		async (request, response) => {
			const getTransactionParamsSchema = z.object({
				id: z.string().uuid(),
			});

			const { id } = getTransactionParamsSchema.parse(request.params);

			const { sessionId } = request.cookies;

			const transaction = await knex("transactions")
				.select("*")
				.where({
					id,
					session_id: sessionId,
				})
				.first();

			if (!transaction) {
				response.status(404).send({ status: "not found" });
			}

			return transaction;
		},
	);

	app.get(
		"/",
		{ preHandler: [checkSessionIdExists] },
		async (request, response) => {
			const { sessionId } = request.cookies;

			const transaction = await knex("transactions")
				.select()
				.where({ session_id: sessionId });

			return { transaction };
		},
	);

	app.get(
		"/summary",
		{ preHandler: [checkSessionIdExists] },
		async (request, response) => {
			const { sessionId } = request.cookies;

			const summary = await knex("transactions")
				.where({ session_id: sessionId })
				.sum("amount", {
					as: "total",
				})
				.first();

			return { summary };
		},
	);
}
