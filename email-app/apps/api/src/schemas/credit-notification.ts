import { z } from "zod"
import { EmailDataSchema } from "./email"

export const creditNotificationSchema = z.object({
  to: z.string().email()
    .or(EmailDataSchema)
    .or(z.array(z.string().email().or(EmailDataSchema))),
  preview: z.string(),
  message: z.string(),
  title: z.string().optional(),
})