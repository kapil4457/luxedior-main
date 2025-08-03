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
export const ContactUsEmailTemplate = ({
  name,
  query,
}: {
  name: string;
  query: string;
}) => {
  const previewText = `Read ${name}'s Query`;
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
              <Text style={heading}>Hi, We have received your query.</Text>
              <Text style={review}>{query}</Text>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section>
            <Row>
              <Text style={paragraph}>We will get back to you soon.</Text>
            </Row>
          </Section>
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
