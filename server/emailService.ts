import { MailService } from '@sendgrid/mail';

// Initialize SendGrid service only if API key is available
let mailService: MailService | null = null;
const isEmailServiceAvailable = !!process.env.SENDGRID_API_KEY;

if (isEmailServiceAvailable) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY!);
  console.log('SendGrid email service initialized successfully');
} else {
  console.warn('SendGrid API key not found - email notifications will be disabled');
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!mailService) {
    console.error('SendGrid mail service is not initialized');
    return false;
  }
  
  try {
    console.log('Attempting to send email:', {
      to: params.to,
      from: params.from,
      subject: params.subject
    });
    
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return false;
  }
}

interface RequestEmailData {
  requestId: number;
  requestType: 'facility' | 'building';
  title: string;
  description: string;
  priority: string;
  location?: string;
  building?: string;
  roomNumber?: string;
  requesterName: string;
  requesterEmail: string;
  organizationName: string;
  createdAt: Date;
}

// Function to send emails using SendGrid dynamic templates
async function sendTemplatedEmails(
  requestData: RequestEmailData,
  adminEmails: string[],
  fromEmail: string,
  requesterTemplateId: string,
  adminTemplateId: string
): Promise<void> {
  if (!mailService) {
    throw new Error('SendGrid mail service is not initialized');
  }

  console.log('Using SendGrid dynamic templates');
  console.log('Requester template:', requesterTemplateId);
  console.log('Admin template:', adminTemplateId);

  // Prepare dynamic template data
  const templateData = {
    request_id: requestData.requestId,
    request_type: requestData.requestType,
    request_type_title: requestData.requestType.charAt(0).toUpperCase() + requestData.requestType.slice(1),
    title: requestData.title,
    description: requestData.description,
    priority: requestData.priority,
    priority_upper: requestData.priority.toUpperCase(),
    location: requestData.location,
    building: requestData.building || '',
    room_number: requestData.roomNumber || '',
    requester_name: requestData.requesterName,
    requester_email: requestData.requesterEmail,
    organization_name: requestData.organizationName,
    submitted_date: requestData.createdAt.toLocaleDateString(),
    submitted_time: requestData.createdAt.toLocaleTimeString(),
    has_building: !!requestData.building,
    has_room: !!requestData.roomNumber,
    priority_class: `priority-${requestData.priority}`,
    location_info: requestData.requestType === 'building' 
      ? `${requestData.building}, Room ${requestData.roomNumber}`
      : requestData.location
  };

  console.log('Template data being sent:', JSON.stringify(templateData, null, 2));

  try {
    // Send email to requester using template
    console.log('Sending templated requester notification...');
    const requesterResponse = await mailService.send({
      to: requestData.requesterEmail,
      from: fromEmail,
      templateId: requesterTemplateId,
      dynamicTemplateData: templateData
    });
    console.log('Requester notification sent successfully');

    // Send emails to admins using template
    console.log('Sending templated admin notifications...');
    for (const adminEmail of adminEmails) {
      try {
        console.log(`Attempting to send admin notification to: ${adminEmail}`);
        const adminResponse = await mailService.send({
          to: adminEmail,
          from: fromEmail,
          templateId: adminTemplateId,
          dynamicTemplateData: templateData
        });
        console.log(`✅ Admin notification sent successfully to ${adminEmail}`);
        console.log(`Response status: ${adminResponse[0].statusCode}`);
        
        // Log response headers for debugging
        if (adminResponse[0].headers) {
          console.log(`Response headers for ${adminEmail}:`, adminResponse[0].headers);
        }
      } catch (adminError) {
        console.error(`❌ Failed to send admin notification to ${adminEmail}:`, adminError);
        
        // Log detailed error information
        if (adminError && typeof adminError === 'object' && 'response' in adminError) {
          const apiError = adminError as any;
          console.error(`SendGrid API Response for ${adminEmail}:`, {
            status: apiError.response?.status,
            statusText: apiError.response?.statusText,
            body: apiError.response?.body
          });
        }
        
        // Continue with other admin emails even if one fails
        console.log(`Continuing with remaining admin emails...`);
      }
    }
    console.log('Admin notifications processing completed');

    console.log(`Templated notification emails sent for request #${requestData.requestId}`);
  } catch (error) {
    console.error('Failed to send templated emails:', error);
    console.error('Template data used:', JSON.stringify(templateData, null, 2));
    
    // Log more detailed error information
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as any;
      console.error('SendGrid API Response:', {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        headers: apiError.response?.headers,
        body: apiError.response?.body
      });
    }
    
    // If template sending fails, fall back to inline HTML
    console.log('Falling back to inline HTML emails due to template failure...');
    throw new Error(`Template email failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check SendGrid configuration.`);
  }
}

export async function sendRequestNotificationEmails(
  requestData: RequestEmailData,
  adminEmails: string[]
): Promise<void> {
  console.log('=== EMAIL NOTIFICATION FUNCTION CALLED ===');
  console.log('Request data:', JSON.stringify(requestData, null, 2));
  console.log('Admin emails:', adminEmails);
  console.log('SendGrid API key exists:', !!process.env.SENDGRID_API_KEY);
  
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'notifications@repairrequest.org';
  
  // SendGrid template IDs from environment variables
  const REQUESTER_TEMPLATE_ID = process.env.SENDGRID_REQUESTER_TEMPLATE_ID;
  const ADMIN_TEMPLATE_ID = process.env.SENDGRID_ADMIN_TEMPLATE_ID;
  
  // Try templates first, then fall back to inline HTML
  console.log('Attempting to use SendGrid templates...');
  
  if (REQUESTER_TEMPLATE_ID && ADMIN_TEMPLATE_ID) {
    try {
      console.log('Using template IDs from environment variables:');
      console.log('Requester template:', REQUESTER_TEMPLATE_ID);
      console.log('Admin template:', ADMIN_TEMPLATE_ID);
      
      await sendTemplatedEmails(requestData, adminEmails, fromEmail, REQUESTER_TEMPLATE_ID, ADMIN_TEMPLATE_ID);
      console.log('✅ Templated emails sent successfully');
      return;
    } catch (templateError) {
      console.error('❌ Template email failed, falling back to inline HTML:', templateError);
      // Continue to inline HTML fallback
    }
  }
  
  // Fallback to inline HTML emails
  console.log('Using inline HTML email fallback...');
  
  // Email template for new request notification
  const generateEmailContent = (isForRequester: boolean) => {
    const subject = isForRequester 
      ? `Your ${requestData.requestType} request has been submitted - #${requestData.requestId}`
      : `New ${requestData.requestType} request submitted - #${requestData.requestId}`;
    
    const locationInfo = requestData.requestType === 'building' 
      ? `Building: ${requestData.building}\nRoom: ${requestData.roomNumber}`
      : `Location: ${requestData.location}`;
    
    const greeting = isForRequester 
      ? `Dear ${requestData.requesterName},`
      : `Dear Administrator,`;
    
    const mainMessage = isForRequester
      ? `Your ${requestData.requestType} request has been successfully submitted and assigned ID #${requestData.requestId}.`
      : `A new ${requestData.requestType} request has been submitted by ${requestData.requesterName}.`;
    
    const text = `${greeting}

${mainMessage}

Request Details:
- Request ID: #${requestData.requestId}
- Type: ${requestData.requestType.charAt(0).toUpperCase() + requestData.requestType.slice(1)} Request
- Title: ${requestData.title}
- Priority: ${requestData.priority.toUpperCase()}
- ${locationInfo}
- Description: ${requestData.description}
- Submitted by: ${requestData.requesterName} (${requestData.requesterEmail})
- Organization: ${requestData.organizationName}
- Date: ${requestData.createdAt.toLocaleDateString()} at ${requestData.createdAt.toLocaleTimeString()}

${isForRequester 
  ? 'You will receive updates as your request is processed by our maintenance team.'
  : 'Please log in to the system to review and assign this request to maintenance staff.'
}

Best regards,
${requestData.organizationName} Maintenance Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0079F2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0079F2; }
        .priority-high { border-left-color: #dc3545; }
        .priority-medium { border-left-color: #ffc107; }
        .priority-low { border-left-color: #28a745; }
        .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>${requestData.organizationName}</h2>
            <p>Maintenance Request System</p>
        </div>
        <div class="content">
            <p>${greeting}</p>
            <p>${mainMessage}</p>
            
            <div class="details priority-${requestData.priority}">
                <h3>Request Details</h3>
                <p><strong>Request ID:</strong> #${requestData.requestId}</p>
                <p><strong>Type:</strong> ${requestData.requestType.charAt(0).toUpperCase() + requestData.requestType.slice(1)} Request</p>
                <p><strong>Title:</strong> ${requestData.title}</p>
                <p><strong>Priority:</strong> ${requestData.priority.toUpperCase()}</p>
                <p><strong>${requestData.requestType === 'building' ? 'Building:' : 'Location:'}</strong> ${requestData.requestType === 'building' ? requestData.building : requestData.location}</p>
                ${requestData.roomNumber ? `<p><strong>Room:</strong> ${requestData.roomNumber}</p>` : ''}
                <p><strong>Description:</strong> ${requestData.description}</p>
                <p><strong>Submitted by:</strong> ${requestData.requesterName} (${requestData.requesterEmail})</p>
                <p><strong>Date:</strong> ${requestData.createdAt.toLocaleDateString()} at ${requestData.createdAt.toLocaleTimeString()}</p>
            </div>
            
            <p>${isForRequester 
              ? 'You will receive updates as your request is processed by our maintenance team.'
              : 'Please log in to the system to review and assign this request to maintenance staff.'
            }</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>${requestData.organizationName} Maintenance Team</p>
        </div>
    </div>
</body>
</html>`;

    return { subject, text, html };
  };

  try {
    // Send email to requester
    console.log('Sending requester notification...');
    const requesterEmail = generateEmailContent(true);
    const requesterSuccess = await sendEmail({
      to: requestData.requesterEmail,
      from: fromEmail,
      subject: requesterEmail.subject,
      text: requesterEmail.text,
      html: requesterEmail.html,
    });
    
    if (requesterSuccess) {
      console.log(`✅ Requester notification sent to ${requestData.requesterEmail}`);
    } else {
      console.error(`❌ Failed to send requester notification to ${requestData.requesterEmail}`);
    }

    // Send email to all admins with detailed logging
    console.log('Sending admin notifications...');
    const adminEmail = generateEmailContent(false);
    let adminSuccessCount = 0;
    
    for (const adminEmailAddress of adminEmails) {
      try {
        console.log(`Attempting to send admin notification to: ${adminEmailAddress}`);
        const adminSuccess = await sendEmail({
          to: adminEmailAddress,
          from: fromEmail,
          subject: adminEmail.subject,
          text: adminEmail.text,
          html: adminEmail.html,
        });
        
        if (adminSuccess) {
          console.log(`✅ Admin notification sent successfully to ${adminEmailAddress}`);
          adminSuccessCount++;
        } else {
          console.error(`❌ Failed to send admin notification to ${adminEmailAddress}`);
        }
      } catch (adminError) {
        console.error(`❌ Error sending admin notification to ${adminEmailAddress}:`, adminError);
      }
    }

    console.log(`📧 Email Summary for Request #${requestData.requestId}:`);
    console.log(`   - Requester: ${requesterSuccess ? '✅ Sent' : '❌ Failed'}`);
    console.log(`   - Admins: ${adminSuccessCount}/${adminEmails.length} sent successfully`);
    
    if (adminSuccessCount === 0 && adminEmails.length > 0) {
      console.error('⚠️ WARNING: No admin emails were sent successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error sending request notification emails:', error);
    throw error;
  }
}