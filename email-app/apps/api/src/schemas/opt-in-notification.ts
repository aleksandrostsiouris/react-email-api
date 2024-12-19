import { z } from "zod"
import { EmailDataSchema } from "./email"
import { entityReference, stakeholders } from "./common";

export const optInNotificationSchema = z.object({
  to: z.string().email()
    .or(EmailDataSchema)
    .or(z.array(z.string().email().or(EmailDataSchema))),
  preview: z.string(),
  message: z.object({
    regarding: entityReference,
    erpCustomer: entityReference,
    relatedEntity: entityReference,
    statusReason: z.string().nullable(),
    createdOn: z.string().datetime(),
    salesPersonFullName: z.string().nullable(),
    creditAmountApplied: z.string(),
    creditAmountApproved: z.string().nullable(),
    appliedPaymentTerms: z.string().nullable(),
    approvedPaymentTerms: z.string().nullable(),
    comments: stakeholders,
    approvers: stakeholders,
    account: entityReference,
    tpUrl: z.string().url().nullable(),
    conditions: z.string().nullable()
  }),
  title: z.string().optional().nullable(),
});
