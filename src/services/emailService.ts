// emailService.ts - Ultra-futuristic email service for RFQ and notifications
import { toast } from '@/components/ui/use-toast';

interface EmailRecipient {
  email: string;
  name?: string;
  type: 'primary' | 'cc' | 'bcc' | 'organization';
}

interface EmailAttachment {
  name: string;
  content: string; // base64 encoded content
  contentType: string;
}

interface EmailOptions {
  subject: string;
  body: string;
  recipients: EmailRecipient[];
  attachments?: EmailAttachment[];
  isTest?: boolean;
  isRfq?: boolean;
}

/**
 * Sends an RFQ email with TEST prefix and organizational email support
 * 
 * @param subject The email subject (will be prefixed with TEST!!! for RFQ emails)
 * @param recipientEmail The primary recipient email
 * @param orgEmail Optional organizational email to CC
 * @param includeOrgEmail Whether to include the organizational email
 * @param pdfContent Base64 encoded PDF content
 * @param fileName The PDF file name
 * @param referenceId The RFQ reference ID
 * @returns Promise resolving to success status
 */
export async function sendRfqEmail(
  subject: string,
  recipientEmail: string,
  orgEmail: string = 'operations@company.com',
  includeOrgEmail: boolean = true,
  pdfContent: string,
  fileName: string,
  referenceId: string
): Promise<boolean> {
  try {
    // Prefix RFQ emails with TEST!!! as requested
    const emailSubject = `TEST!!! - RFQ Testing: ${subject}`;
    
    // Set up recipients
    const recipients: EmailRecipient[] = [
      { email: recipientEmail, type: 'primary' }
    ];
    
    // Include organization email if requested
    if (includeOrgEmail && orgEmail) {
      recipients.push({ email: orgEmail, type: 'organization' });
    }
    
    // Create email content
    const emailOptions: EmailOptions = {
      subject: emailSubject,
      body: `
        <h2>TEST!!! TESTING!! [Request for Quotation]</h2>
        <p>Reference ID: ${referenceId}</p>
        <p>Please find attached the RFQ document for your review.</p>
        <p>This is a test email. In a production environment, this would contain additional details about the RFQ.</p>
      `,
      recipients,
      attachments: [
        {
          name: fileName,
          content: pdfContent,
          contentType: 'application/pdf'
        }
      ],
      isTest: true,
      isRfq: true
    };
    
    // In a real-world implementation, this would call an API endpoint
    // For now, we'll simulate sending
    console.log('Sending RFQ email with the following configuration:');
    console.log(`Subject: ${emailOptions.subject}`);
    console.log(`Recipients: ${emailOptions.recipients.map(r => r.email).join(', ')}`);
    console.log(`Attachment: ${fileName}`);
    
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return true;
  } catch (error) {
    console.error('Error sending RFQ email:', error);
    return false;
  }
}

/**
 * Handles RFQ email sending with proper UI feedback
 * 
 * @param recipientEmail The main recipient's email address
 * @param orgEmail The organization email address
 * @param includeOrgEmail Whether to include the organization email
 * @param referenceId The RFQ reference ID
 * @param pdfContent The PDF content as base64
 * @returns Promise resolving to success status
 */
export async function handleRfqEmailSending(
  recipientEmail: string,
  orgEmail: string,
  includeOrgEmail: boolean,
  referenceId: string,
  pdfContent: string
): Promise<boolean> {
  try {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }
    
    if (includeOrgEmail && !emailRegex.test(orgEmail)) {
      toast({
        title: "Invalid Organization Email",
        description: "Please enter a valid organization email address",
        variant: "destructive"
      });
      return false;
    }
    
    // Generate filename
    const fileName = `RFQ_${referenceId}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Send email
    const sent = await sendRfqEmail(
      `RFQ ${referenceId}`,
      recipientEmail,
      orgEmail,
      includeOrgEmail,
      pdfContent,
      fileName,
      referenceId
    );
    
    if (sent) {
      const recipients = [recipientEmail];
      if (includeOrgEmail) recipients.push(orgEmail);
      
      toast({
        title: "Email Sent",
        description: `The RFQ has been sent to ${recipients.length} recipient(s) with TEST!!! prefix`,
      });
      return true;
    } else {
      toast({
        title: "Email Failed",
        description: "There was a problem sending the email. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error('Error in email sending process:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while sending the email.",
      variant: "destructive"
    });
    return false;
  }
}
