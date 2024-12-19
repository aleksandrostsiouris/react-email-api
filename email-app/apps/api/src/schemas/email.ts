import { z } from "zod"

export const EmailSchema = z.object({
  to: z.string().or(z.object(
    {
      name: z.string(),
      email: z.string()
    }
  )).array()
})

export const EmailDataSchema = z.object({
  name: z.string(),
  email: z.string()
})