import { z } from "zod";

export const entityReference = z.object({
  id: z.string().uuid(),
  entityType: z.string(),
  name: z.string().nullable()
});

export const stakeholders = z.object({
  credit: z.string().nullable(),
  commercial: z.string().nullable()
});