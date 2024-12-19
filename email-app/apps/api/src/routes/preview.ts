import { HTTPException } from "hono/http-exception";
import { availableTemplates } from "../../src/templates"
import { renderAsync } from "@react-email/render";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();
app.get("/:template", async c => {
  const template = c.req.param("template");

  if (!availableTemplates.includes(template)) {
    return c.notFound();
  }

  const defautlModule = (await import(`./../../../../packages/ui/src/emails/${template}.tsx`))?.default;
  if (!defautlModule) throw new Error();
  const jsx = defautlModule({});
  const html = await renderAsync(jsx);

  return c.html(html);
})
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse()
    }
    console.error(err);
    c.status(500);
    return c.json({
      title: "Hold your horses, something's wrong",
      error: {
        code: (err as any).code,
        message: err.message,
      }
    });
  });

export default app;