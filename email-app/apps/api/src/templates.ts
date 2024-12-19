import { creditNotificationSchema } from "./schemas/credit-notification";
import { optInNotificationSchema } from "./schemas/opt-in-notification";
import { ZodSchema } from "zod"

export const availableTemplates = [
  'credit-notification',
  'opt-in-notification'
];

export const isValidTemplate = async (template: string, body: any) => {
  if (!availableTemplates.includes(template)) {
    throw new Error(`Template ${template} not found`);
  }

  let schema; ZodSchema;
  switch (template) {
    case 'credit-notification':
      schema = creditNotificationSchema;
    case 'opt-in-notification':
      schema = optInNotificationSchema;
  }

  if (!schema) throw new Error(`Template ${template} not found`);
  const { success, error, data } = await schema.safeParseAsync(body);

  if (!success) {
    console.error(error)
    throw new Error(JSON.stringify(error.errors));
  }

  console.log("Email template is valid")
  return { data } as const;
}