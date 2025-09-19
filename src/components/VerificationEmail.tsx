import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Link,
  Hr,
} from '@react-email/components';

interface VerificationEmailProps {
  userName: string;
  verificationLink: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  userName,
  verificationLink,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Hesabını Doğrula</Heading>
        <Text style={paragraph}>Merhaba {userName},</Text>
        <Text style={paragraph}>
          RENTORA'ya kaydolduğun için teşekkürler. Hesabını doğrulamak ve
          kullanmaya başlamak için lütfen aşağıdaki butona tıkla.
        </Text>
        <Button style={button} href={verificationLink}>
          E-postamı Doğrula
        </Button>
        <Text style={paragraph}>
          Eğer bu butona tıklayamıyorsan, aşağıdaki linki kopyalayıp
          tarayıcına yapıştırabilirsin:
        </Text>
        <Link href={verificationLink} style={link}>
          {verificationLink}
        </Link>
        <Hr style={hr} />
        <Text style={footer}>
          Bu e-postayı sen istemediysen, lütfen dikkate alma.
        </Text>
      </Container>
    </Body>
  </Html>
);

// --- Basit Stil Tanımları ---
const main = {
  backgroundColor: '#000000',
  fontFamily: 'Arial, sans-serif',
  color: '#ffffff',
};
const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  backgroundColor: '#1a1a1a',
  border: '1px solid #444',
  borderRadius: '8px',
};
const heading = {
  fontSize: '28px',
  color: '#f5b50a',
  padding: '0 20px',
};
const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#cccccc',
  padding: '0 20px',
};
const button = {
  backgroundColor: '#f5b50a',
  borderRadius: '5px',
  color: '#000000',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  margin: '20px',
  fontWeight: 'bold',
};
const link = {
  color: '#f5b50a',
  wordBreak: 'break-all' as const,
};
const hr = {
  borderColor: '#444',
  margin: '20px 0',
};
const footer = {
  color: '#888888',
  fontSize: '12px',
  padding: '0 20px',
};