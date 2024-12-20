import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { pingRoute, previewRoute, sendRoute, generateKeyRoute } from "./routes/index"
import { showRoutes } from "hono/dev"
import { prettyJSON } from 'hono/pretty-json'
import { rateLimiter } from "hono-rate-limiter"
import { logger } from "hono/logger"
import { timing } from 'hono/timing';
import { jwt } from 'hono/jwt'
import * as dotenv from "dotenv"
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono();
const authedRoutes = [
  "send",
  "preview",
  "generate"
];

dotenv.config();
app.use(prettyJSON())
app.use(timing({
  autoEnd: true,
  total: true
}));
app.use(logger());
app.use(rateLimiter({
  windowMs: 3 * 6000, // 3 mins
  limit: 30,
  standardHeaders: "draft-6",
  keyGenerator: (c) => (c.env as any)?.socket?.remoteAddress ?? "common"
}))

app.use(
  (async (c, next) => {
    const isAuthedRoute = c.req.path
      .split("/")
      .some(x => authedRoutes.includes(x));

    if (!isAuthedRoute)
      return await next();

    const jwtMiddleware = jwt({
      secret: process.env.JWT_SECRET!
    });
    return await jwtMiddleware(c, next);
  })
);

app.route("/send", sendRoute);
app.route("/ping", pingRoute);
app.route("/preview", previewRoute);
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Email API",
  },
});
app.openAPIRegistry.registerComponent(
  'securitySchemes',
  "AuthorizationBearer",
  {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
  },
);
app.get('/swagger', swaggerUI({ url: '/doc' }));

const port = process.env.PORT ?
  +process.env.PORT :
  3030;

console.log(`Server is running on port ${port}`);
showRoutes(app);

serve({
  fetch: app.fetch,
  port
});
