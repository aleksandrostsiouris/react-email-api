import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { renderAsync } from "@react-email/render"
import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import { isValidTemplate as validateTemplate } from "../../src/templates"
import * as dotenv from "dotenv"
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { emailNotificationSchema } from '../schemas/email-notification';
dotenv.config();

const app = new OpenAPIHono();
const from = process.env.FROM ?? "no-reply@host.com";
app.post("/:template", async (c) => {
  const template = c.req.param("template");
  const body = await c.req.json();
  const { data } = await validateTemplate(template, body);

  const { preview, to } = body;
  const defaultModule = (await import(`./../../../../packages/ui/src/emails/${template}.tsx`))?.default;

  console.log(defaultModule)
  if (!defaultModule) throw new Error("Template doesn't match the file name. If template `new-template` then the email file shall be `new-template.tsx` (@email-app/packages/ui/src/emails/new-template.tsx)");
  const jsx = defaultModule({ ...data });
  const html = await renderAsync(jsx);

  sendgrid.setApiKey(process.env.SENDGRID_APIKEY!);
  const options: MailDataRequired = {
    to: to,
    subject: preview,
    html,
    from: from
  }
  await sendgrid.send(options);

  return c.json({
    message: "Email successfully sent",
    to: to
  });
})
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
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

const sendOpenApiRoute = createRoute({
  method: "post",
  path: "/:template",
  description: "Sends email based on templates",
  security: [
    {
      "AuthorizationBearer": []
    }
  ],
  request: {
    headers: z.object({
      "Authorization": z.string().optional()
    }),
    body: {
      required: true,
      content: {
        "application/json": {
          schema: emailNotificationSchema,
          example:{
            preview: "Preview",
            title: "Title",
            to: "bruce@wayne.com",
            message: "Hello world"
          }
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            to: z.string()
          }),
          example: {
            "message": "Email successfully sent",
            "to": "elon@tesla.com"
          }
        }
      },
      description: "Successfull request"
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            title: z.string(),
            message: z.string()
          }),
          example: {
            "title": "Hold your horses, something's wrong",
            "error": {
              "message": "Unexpected end of JSON input"
            }
          }
        }
      },
      description: "Invalid request"
    }
  }
})

app.openapi(sendOpenApiRoute, (c: any) => {
  const { Authorization } = c.req.valid("header");

  if (Authorization) {
    return c.json({
      message: "Email successfully sent",
      to: "bezos@aws.com"
    });
  }

  return c.json({
    error: "Unauthorized"
  }, 401)
})

export default app;