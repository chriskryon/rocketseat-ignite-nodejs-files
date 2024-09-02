import fastify from "fastify";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";

const app = fastify();

// GET, POST, PUT, PATCH, DELETE

app.register(cookie);
app.register(transactionsRoutes, { prefix: "/transactions" });

app.listen({ port: env.PORT }).then(() => {
	console.log("App is running on port 3333");
});
