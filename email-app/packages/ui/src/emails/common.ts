export type EmailProps = {
  preview: string,
  title?: string | undefined,
  message: string,
}

export type EntityReference = {
  id: string,
  entityType: string,
  name?: string
}