import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

// https://hono.dev/snippets/swagger-ui
const app = new OpenAPIHono();
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Email API",

  },
});
app.get("/ui", swaggerUI({ url: "/doc" }));

export default app;