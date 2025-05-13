
export interface Message {
  role: 'user' | 'oracle';
  content: string | React.ReactNode;
  id: string;
  hasTable?: boolean;
}

export interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
}
