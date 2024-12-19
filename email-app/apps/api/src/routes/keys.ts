import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter"

const app = new Hono();

app.use("/:client", rateLimiter({
  windowMs: 30 * 6000, // 30 mins
  limit: 1,
  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    const clientId = c.req.param('client');
    if (!clientId) throw new Error("Please provide a client, to generate a key for. Example: /generate/crm")
    console.log("Generating key for clientId:", clientId);
    return clientId;
  }
}))
  .onError((error, c) => {
    c.status(400);
    return c.text(error.message);
  });

app.get('/:client', (c) => {
  const clientId = c.req.param('client');
  // Gen jwt and store it to KeyVault 
  return c.text(clientId)
});


export default app;