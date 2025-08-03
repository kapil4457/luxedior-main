import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { OrderProduct, ShippingAddress } from "@/interfaces/Order";

export const OrderSuccessEmailTemplateClient = async ({
  name,
  orderItems,
  transactionId,
  orderValue,
  shippingAddress,
}: {
  orderItems: OrderProduct[];
  name: string;
  transactionId: string;
  orderValue: string;
  shippingAddress: ShippingAddress;
}) => {
  const previewText = `Order placed successfully`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section>
            <a href={process.env.NEXT_PUBLIC_WEBSITE_URL}>
              <Img
                src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}logo.png`}
                style={{
                  height: "4rem",
                }}
              />
            </a>
          </Section>

          <Section style={{ paddingBottom: "20px" }}>
            <Row>
              <Text style={heading}>
                Thanks for placing the order {name} !!
              </Text>
              <Text>Order Id : {transactionId}</Text>
            </Row>
          </Section>
          <Section
            style={{
              paddingBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <Row>
              <Text style={subHeading}>Order Items</Text>
            </Row>
            {orderItems?.map((item, key) => {
              const name = `${item.title}`;
              const itemQuantity = item.quantity;
              const price = item.price;
              const image = item.coverImage;
              const slug = item.slug;
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    gap: "2rem",
                    width: "580px",
                    height: "7rem",
                    justifyContent: "space-between"!,
                    alignItems: "center",
                  }}
                >
                  <img
                    src={image}
                    style={{
                      borderRadius: "10px",
                      height: "4rem",
                      width: "4rem",
                    }}
                  />
                  <a
                    href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}product/${slug}`}
                  >
                    <p
                      style={{
                        paddingLeft: "3rem",
                      }}
                    >
                      {name}
                    </p>
                  </a>
                  <p
                    style={{
                      paddingLeft: "3rem",
                    }}
                  >
                    x {itemQuantity} pcs
                  </p>
                  <p
                    style={{
                      paddingLeft: "3rem",
                    }}
                  >
                    ₹{price}
                  </p>
                </div>
              );
            })}
            <Row>
              <h2>Total : {orderValue}</h2>
            </Row>
          </Section>
          <Section style={{ paddingTop: "20px" }}>
            <Row>
              <Text style={subHeading}>Shipping Details</Text>
            </Row>
            <Row>
              <Text style={paragraph}>
                {shippingAddress.addressLine1}
                <br />
                {shippingAddress.addressLine2 && (
                  <>
                    {shippingAddress.addressLine2}
                    <br />
                  </>
                )}
                {shippingAddress.city}, {shippingAddress.state} -{" "}
                {shippingAddress.postalCode}
                <br />
                {shippingAddress.country}
                <br />
                📞 {shippingAddress.phoneNumber}
              </Text>
            </Row>
          </Section>

          <Hr style={hr} />
          <Section>
            <Row>
              <Text style={footer}>
                <div className="flex flex-col gap-2 items-center">
                  <div>
                    <a href={process.env.NEXT_PUBLIC_WEBSITE_URL}>
                      <Img
                        src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}logo.png`}
                        style={{
                          height: "4rem",
                        }}
                      />
                    </a>
                  </div>
                  <div className="flex gap-2 font-semibold">
                    &copy; {new Date().getFullYear()}, All rights reserved
                  </div>
                  <br />
                  <div className="flex gap-2 font-semibold text-gray-600">
                    <b>Note : </b> This is a system generated email. Please do
                    not respond to it.
                  </div>
                </div>
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// export default ContactUsEmailTemplate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const userImage = {
  margin: "0 auto",
  marginBottom: "16px",
  borderRadius: "50%",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};
const subHeading = {
  fontSize: "25px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const review = {
  ...paragraph,
  padding: "24px",
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
};

const button = {
  backgroundColor: "#ff5a5f",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "18px",
  paddingTop: "19px",
  paddingBottom: "19px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

const link = {
  ...paragraph,
  color: "#ff5a5f",
  display: "block",
};

const reportLink = {
  fontSize: "14px",
  color: "#9ca299",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#9ca299",
  fontSize: "14px",
  marginBottom: "10px",
};
