import {
  Html,
  Head,
  Body,
  Container,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Img,
  Hr,
} from "@react-email/components";

// NOTE: make otp to number type
interface VerificationEmailProps {
  username: string;
  otp: string | number;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        The sales intelligence platform that helps you uncover qualified leads.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`/static/koala-logo.png`}
            width="170"
            height="50"
            alt="Whisper Review"
            style={logo}
          />
          <Text style={paragraph}>Hi {username},</Text>
          <Text style={paragraph}>
            Welcome to Whisper Review, a feedback platform that helps you
            to send feedback anonymously.
          </Text>
          <Text>'{otp}' is your one time password.</Text>
          <Section style={btnContainer}>
            <Button style={button} href="">
              Get started
            </Button>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />
            Whisper Review team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>India</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
