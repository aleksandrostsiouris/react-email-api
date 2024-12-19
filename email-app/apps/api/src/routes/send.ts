import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { renderAsync } from "@react-email/render"
import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import { isValidTemplate as validateTemplate } from "../../src/templates"
import * as dotenv from "dotenv"
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { optInNotificationSchema } from '../schemas/opt-in-notification';
dotenv.config();

const app = new OpenAPIHono();
const from = "no-reply@bunker-holding.com";
app.post("/:template", async (c) => {
  const template = c.req.param("template");
  const body = await c.req.json();
  const { data } = await validateTemplate(template, body);

  const { preview, to } = body;
  const defaultModule = (await import(`./../../../../packages/ui/src/emails/${template}.tsx`))?.default;

  console.log(defaultModule)
  if (!defaultModule) throw new Error("Template doesn't match the file name. If template `new-template` then the email file shall be `new-template.tsx` (@bh-email/packages/ui/src/emails/new-template.tsx)");
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

  console.log(`Regarding: ${data.message.regarding.name} with id {${data.message.regarding.id}} (${data.message.regarding.entityType})`);
  console.log(`Related entity: ${data.message.relatedEntity.name} with id {${data.message.relatedEntity.id}} (${data.message.relatedEntity.entityType})`);
  console.log(`Email sent to ${to instanceof Array ? to.join(",") : to}`);

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
          schema: optInNotificationSchema,
          example: {
            "preview": "Credit - MD-Acc1",
            "title": "Credit was Applied",
            "to": "youremail@bunker-holding.com",
            "message": {
              "regarding": {
                "id": "3f28830c-8068-458f-81b5-85bc885b2b13",
                "entityType": "opportunity",
                "name": "Test Opportunity"
              },
              "relatedEntity": {
                "id": "693aeb16-3efc-4b2f-9582-7b39fbe18a16",
                "entityType": "incident",
                "name": "Incident 1"
              },
              "comments": {
                "credit": null,
                "commercial": null
              },
              "account": {
                "id": "a28ec890-585f-4c6d-9a8c-ba6170134418",
                "entityType": "account",
                "name": "MD-Acc1"
              },
              "erpCustomer": {
                "id": "2d61c795-e6b4-4d97-a7ec-0635c4655a04",
                "entityType": "dg_erpcustomer",
                "name": "Brand Customer Name"
              },
              "statusReason": "Approved",
              "createdOn": "2024-05-29T12:59:09.2054003Z",
              "salesPersonFullName": null,
              "creditAmountApplied": "1,000.00 $",
              "creditAmountApproved": "1,000.00 $",
              "approvedPaymentTerms": "DOD +15",
              "appliedPaymentTerms": "DOD +15",
              "approvers": {
                "credit": "Credit Manager 1",
                "commercial": null
              },
              "approvalStatus": {
                "credit": "Approved",
                "commercial": null
              },
              "tpUrl": "https://localhost:4040",
              "conditions": null
            }
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
            "to": "alet@bunker-holding.com"
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