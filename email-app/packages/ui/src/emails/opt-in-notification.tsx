import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { format, formatDistanceToNow } from "date-fns";
import * as React from "react";
import { EmailProps, EntityReference } from "./common";

export type OptInNotificationEmailProps = Pick<EmailProps, 'title' | 'preview'> & {
  message: {
    regarding: EntityReference,
    relatedEntity: EntityReference,
    comments: {
      credit?: string,
      commercial?: string
    },
    approvalStatus: {
      credit: string,
      commercial: string
    }
    account: EntityReference,
    erpCustomer: EntityReference,
    statusReason: string,
    createdOn: string,
    salesPersonFullName: string,
    creditAmountApplied: string,
    creditAmountApproved: string,
    appliedPaymentTerms: string,
    approvedPaymentTerms: string,
    approvers: {
      credit: string,
      commercial?: string
    }
    tpUrl: string,
    conditions: string
  }
}

export const OptInNotificationEmail = (
  {
    preview = "Credit has been approved",
    title = "Title",
    message = {
      account: {
        entityType: "entityType",
        id: "id",
        name: "Maersk SA"
      },
      approvalStatus: {
        credit: "Approved",
        commercial: "Approved"
      },
      tpUrl: "https://bh-crm-dev.crm4.dynamics.com/main.aspx?appid=95658717-aa76-479b-8ea3-f527bd41cf5b",
      comments: {},
      relatedEntity: {
        entityType: "entityType",
        id: "id",
        name: "Maersk SA"
      },
      regarding: {
        entityType: "entityType",
        id: "id",
        name: "Opp @ Vessel 123"
      },
      createdOn: "2020-04-20T11:42:13Z",
      creditAmountApplied: "1000 $",
      creditAmountApproved: "1000 $",
      appliedPaymentTerms: "DOD +30",
      approvedPaymentTerms: "DOD +30",
      erpCustomer: {
        entityType: "erp",
        id: "id",
        name: "ERPCustomer1"
      },
      approvers: {
        credit: "ALET"
      },
      salesPersonFullName: "ALET BRO",
      statusReason: "Approved",
      conditions: "Load over Load: 12/ Owner Confirmation: yes/ Load over Load: 12/ Owner Confirmation: yes/ Due Amount: 12,000.00 $"
    },
  }: OptInNotificationEmailProps
) => {
  const shouldDisplayCommercial = message.approvers.commercial ||
    message.comments.commercial || message.conditions

  return (
    <Html>
      <Head >
        {/* <Font/> */}
      </Head>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#e41b13",
              },
            },
          },
        }}>
        <Preview>
          {preview} - {message.account.name ?? ""}
        </Preview>
        <Body className="font-sans bg-zinc-100">
          <Container className="bg-white rounded-2xl my-16">
            <Container className="w-full text-center">
              {/* <Container className="bg-brand mt-10 rounded-2xl"> */}
              {/* <Img
                  className="h-60 m-auto"
                  src="https://crmpublicstorageprod.blob.core.windows.net/publicimages/BunkerHoldngGroup_CMYK_White.png"
                  alt="BH"
                /> */}

              <center className="bg-brand w-[350px] m-auto mt-10 rounded-xl">
                <Img
                  width={250}
                  height={200}
                  className="m-auto"
                  src="https://crmpublicstorageprod.blob.core.windows.net/publicimages/BunkerHoldngGroup_CMYK_White.png"
                  alt="BH"
                />
              </center>
              {/* </Container> */}
              <Text className="text-2xl font-bold mt-12 mb-10">
                {title}
              </Text>
            </Container>

            <Section className="text-left px-12 mb-5">

              <Row className="w-full">
                <Column className="font-bold text-lg w-1/2">
                  General
                </Column>
              </Row>

              <Row className="ml-2 w-full">
                <Column className="w-1/2">
                  Subject:
                </Column>
                <Column className="w-1/2">
                  {preview}
                </Column>
              </Row>

              <Row className="ml-2 w-full">
                <Column className="w-1/2">
                  Regarding:
                </Column>
                <Column className="w-1/2">

                  <Link
                    href={`${message.tpUrl}
                    &pageType=entityrecord&etn=${message.regarding.entityType}&id=${message.regarding.id}`}
                    className="font-semibold">
                    {message.regarding.name && `${message.regarding.name} ◳`}
                  </Link>
                </Column>
              </Row>

              <Row className="ml-2 w-full">
                <Column className="w-1/2">
                  Credit Application:
                </Column>
                <Column className="w-1/2">

                  <Link
                    href={`${message.tpUrl}
                       &pageType=entityrecord&etn=${message.relatedEntity.entityType}&id=${message.relatedEntity.id}`}
                    className="font-semibold">
                    {message.relatedEntity.name && `${message.relatedEntity.name} ◳`}
                  </Link>
                </Column>
              </Row>

              <Hr />

              <Row className="w-full">
                <Column className="font-bold text-lg w-1/2">
                  Credit Information
                </Column>
              </Row>

              {
                message.comments?.credit &&
                <Row className="ml-2 w-full">
                  <Column className="w-1/2">
                    Comment from Managers:
                  </Column>
                  <Column className="w-1/2">
                    <div className="bg-[#ffff00] inline-block">
                      {message.comments.credit}
                    </div>
                  </Column>
                </Row>
              }


              {
                message.approvers?.credit &&
                <Row className="ml-2 w-full">
                  <Column className="w-1/2">
                    Approvers:
                  </Column>
                  <Column className="w-1/2">
                    {message.approvers.credit}
                  </Column>
                </Row>
              }

              {
                message.approvalStatus?.credit &&
                <Row className="ml-2 w-full">
                  <Column className="w-1/2">
                    Status:
                  </Column>
                  <Column className="w-1/2">
                    {message.approvalStatus.credit}
                  </Column>
                </Row>
              }

              <Row className="ml-2 w-full">
                <Column className="w-1/2">
                  Account:
                </Column>
                <Column className="w-1/2">
                  <Link
                    href={`${message.tpUrl}
                        &pageType=entityrecord&etn=${message.account.entityType}&id=${message.account.id}`}
                    className="font-semibold">
                    {message.account.name && `${message.account.name} ◳`}
                  </Link>
                </Column>
              </Row>

              <Row className="ml-2 w-full">
                <Column className="w-1/2">
                  ERP Customer:
                </Column>
                <Column className="w-1/2">

                  <Link
                    href={`${message.tpUrl}
                      &pageType=entityrecord&etn=${message.erpCustomer.entityType}&id=${message.erpCustomer.id}`}
                    className="font-semibold">
                    {message.erpCustomer.name && `${message.erpCustomer.name} ◳`}
                  </Link>
                </Column>
              </Row>

              <Row className="ml-2 w-full">
                <Column className="w-1/2">
                  Status Reason:
                </Column>
                <Column className="w-1/2">
                  {message.statusReason}
                </Column>
              </Row>

              <Row className="ml-2 w-full">
                <Column className="w-1/2">
                  Created On:
                </Column>
                <Column className="w-1/2">
                  {format(message.createdOn, "do MMMM yyyy")} ({formatDistanceToNow(message.createdOn)} ago)
                </Column>
              </Row>


              {
                message.salesPersonFullName &&
                <Row className="ml-2 w-full">
                  <Column className="w-1/2">
                    Sales Person BH:
                  </Column>
                  <Column className="w-1/2">
                    {message.salesPersonFullName}
                  </Column>
                </Row>
              }

              <Row className="ml-2 w-full">
                <Column className="w-1/2">
                  Credit Ammount Applied:
                </Column>
                <Column className="w-1/2">
                  {message.creditAmountApplied}
                </Column>
              </Row>


              {
                message.creditAmountApproved &&
                <Row className="ml-2 w-full">
                  <Column className="w-1/2">
                    Credit Ammount Approved:
                  </Column>
                  <Column className="w-1/2">
                    {message.creditAmountApproved}
                  </Column>
                </Row>
              }

              {
                message.appliedPaymentTerms &&
                <Row className="ml-2 w-full">
                  <Column className="w-1/2">
                    Payment Terms Applied:
                  </Column>
                  <Column className="w-1/2">
                    {message.appliedPaymentTerms}
                  </Column>
                </Row>
              }

              {
                message.approvedPaymentTerms &&
                <Row className="ml-2 w-full">
                  <Column className="w-1/2">
                    Payment Terms Approved:
                  </Column>
                  <Column className="w-1/2">
                    {message.approvedPaymentTerms}
                  </Column>
                </Row>
              }

              {
                shouldDisplayCommercial &&
                <React.Fragment>
                  <Hr />
                  <Row className="w-full">
                    <Column className="font-bold text-lg w-1/2">
                      Commercial Information
                    </Column>
                  </Row>

                  {
                    message.comments?.commercial &&
                    <Row className="ml-2 w-full">
                      <Column className="w-1/2">
                        Comment:
                      </Column>
                      <Column className="w-1/2">
                        <div className="bg-[#ffff00] inline-block">
                          {message.comments.commercial}
                        </div>
                      </Column>
                    </Row>
                  }

                  {
                    message.approvers?.commercial &&
                    <Row className="ml-2 w-full">
                      <Column className="w-1/2">
                        Approver:
                      </Column>
                      <Column className="w-1/2">
                        {message.approvers.commercial}
                      </Column>
                    </Row>
                  }

                  {
                    message.approvalStatus?.commercial &&
                    <Row className="ml-2 w-full">
                      <Column className="w-1/2">
                        Status:
                      </Column>
                      <Column className="w-1/2">
                        {message.approvalStatus.commercial}
                      </Column>
                    </Row>
                  }

                  {
                    message.conditions &&
                    <Row className="ml-2 w-full">
                      <Column className="w-1/2">
                        Conditions:
                      </Column>
                      <Column>
                        {
                          message.conditions?.split('/').map((x, i) => {
                            return (
                              <Row
                                key={i}>
                                {x}
                              </Row>
                            )
                          })
                        }
                      </Column>
                    </Row>
                  }

                </React.Fragment>
              }

            </Section>

            <Section className="px-12">
              <Hr />
              <Row className="px-4 mb-3 w-full">
                <Column align="center" className="w-2/12">
                  <Img
                    width={35}
                    height={35}
                    // className="w-8 h-8 rounded-lg"
                    className="rounded-lg"
                    src="https://crmpublicstoragedev.blob.core.windows.net/publicimages/logo_sm.png" />
                </Column>
                <Column
                  className="w-10/12"
                  align="center">
                  <Text className="text-zinc-400 text-xs text-left">
                    This is an automated email notification from the Trading platform.<br></br>Please ignore if irrelevant or contact an administrator.
                  </Text>
                </Column>
              </Row>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default OptInNotificationEmail;