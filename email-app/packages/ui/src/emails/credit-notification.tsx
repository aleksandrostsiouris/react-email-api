import {
  Body,
  Button,
  Column,
  Container,
  Font,
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
import * as React from "react";
import { paragraph } from "../lorem/paragraph"
import { EmailProps } from "./common";

export const CreditNotificationEmail = (
  {
    preview = "Credit Notification",
    title = "Credit Notification",
    message = paragraph,
  }: EmailProps
) => (
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
      }}
    >
      <Preview>
        {preview}
      </Preview>
      <Body className="font-sans bg-zinc-100">
        <Container className="bg-white rounded-2xl my-16">
          <Section className="w-full px-10 text-center">
            <Container className="bg-brand m-auto mt-10 rounded-2xl">
              <Img
                className="h-60 m-auto"
                src="https://crmpublicstorageprod.blob.core.windows.net/publicimages/BunkerHoldngGroup_CMYK_White.png"
                alt="BH"
              />
            </Container>
            <Text className="text-2xl font-bold mt-12 mb-10">
              {title}
            </Text>

            <Text className="text-left">
              {message}
            </Text>
          </Section>

          <Section className="px-12">
            <Hr />
            <Row className="px-4 mb-3">
              <Column align="center">
                <Img
                  className="w-8 h-8"
                  src="https://crmpublicstoragedev.blob.core.windows.net/publicimages/logo_sm.png" />
              </Column>
              <Column
                className="pl-2"
                align="center">
                <Text className="text-zinc-400 text-xs text-left">
                  This is an automated email notification from the Trading platform. Please ignore if irrelevat or contact an administrator.
                </Text>
              </Column>
            </Row>


          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export default CreditNotificationEmail;