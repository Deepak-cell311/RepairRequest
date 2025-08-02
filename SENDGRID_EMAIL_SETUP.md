# SendGrid Email Setup for Repair Request System

## Overview

The repair request system has been configured to send email notifications when requests are submitted. The email functionality is already implemented and working for both facility requests and building requests.

## Email Configuration

### Environment Variables

The following environment variables are configured in `.env`:

```env
SENDGRID_API_KEY=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
SENDGRID_FROM_EMAIL=notifications@SchoolHouselogistics.com
SENDGRID_REQUESTER_TEMPLATE_ID=d-2da91c2d43c54e968dba7e20f8f30d27
SENDGRID_ADMIN_TEMPLATE_ID=d-350141c85514463b885f6fcf3f4a44f9
```

### Email Service Implementation

The email functionality is implemented in `server/emailService.ts` with the following features:

1. **SendGrid Integration**: Uses `@sendgrid/mail` package for email delivery
2. **Template Support**: Supports both SendGrid dynamic templates and inline HTML
3. **Dual Notifications**: Sends emails to both the requester and admin staff
4. **Error Handling**: Graceful error handling that doesn't fail the request if email fails

## Email Flow

### When a Request is Submitted

1. **Facility Request** (`POST /api/requests`):
   - User submits a facility/labor request
   - System creates the request in the database
   - Email notifications are sent to:
     - The requester (confirmation email)
     - All admin users in the organization (notification email)

2. **Building Request** (`POST /api/building-requests`):
   - User submits a building/repair request with photos
   - System creates the request and uploads photos
   - Email notifications are sent to:
     - The requester (confirmation email)
     - All admin users in the organization (notification email)

### Email Content

The emails include:
- Request ID and type
- Priority level
- Location/building information
- Description
- Requester details
- Submission date and time
- Organization information

## Email Templates

### SendGrid Dynamic Templates

The system is configured to use SendGrid dynamic templates with the following template IDs:
- **Requester Template**: `d-2da91c2d43c54e968dba7e20f8f30d27`
- **Admin Template**: `d-350141c85514463b885f6fcf3f4a44f9`

### Fallback HTML Templates

If SendGrid templates are not available, the system falls back to inline HTML templates with:
- Professional styling
- Responsive design
- Color-coded priority indicators
- Clear request details

## Testing Email Functionality

### Test Endpoint

You can test the email functionality using the test endpoint:

```bash
POST /api/test-email
```

This endpoint sends test emails to verify the notification system is working.

### Manual Testing

1. Submit a facility request through the web interface
2. Submit a building request with photos
3. Check email inboxes for notifications

## Admin Email Configuration

Admin emails are automatically retrieved from the database based on:
- Users with `admin` role in the organization
- Organization-specific admin users

The system uses the `getOrganizationAdminEmails()` function to fetch admin emails.

## Error Handling

The email system includes comprehensive error handling:

1. **API Key Validation**: Checks if SendGrid API key is available
2. **Template Fallback**: Falls back to inline HTML if templates fail
3. **Non-blocking**: Email failures don't prevent request submission
4. **Detailed Logging**: All email operations are logged for debugging

## Troubleshooting

### Common Issues

1. **Emails not sending**:
   - Check if `SENDGRID_API_KEY` is set correctly
   - Verify the API key has proper permissions
   - Check server logs for error messages

2. **Template errors**:
   - Verify template IDs are correct
   - Check if templates exist in SendGrid account
   - System will fall back to inline HTML if templates fail

3. **Admin emails not found**:
   - Ensure admin users exist in the database
   - Check if users have the correct role (`admin`)
   - Verify organization associations

### Debugging

The system includes extensive logging:
- Email service initialization
- Template usage
- Email sending attempts
- Error details
- Success confirmations

## Security Considerations

1. **API Key Protection**: SendGrid API key is stored in environment variables
2. **Email Validation**: Recipient emails are validated before sending
3. **Rate Limiting**: SendGrid handles rate limiting automatically
4. **Error Privacy**: Error messages don't expose sensitive information

## Future Enhancements

Potential improvements for the email system:

1. **Email Preferences**: Allow users to configure email notification preferences
2. **Status Updates**: Send emails for status changes and updates
3. **Assignment Notifications**: Notify when requests are assigned to maintenance staff
4. **Completion Notifications**: Send emails when requests are completed
5. **Custom Templates**: Allow organizations to customize email templates

## Dependencies

The email functionality requires:
- `@sendgrid/mail`: SendGrid email service
- Valid SendGrid API key
- Properly configured environment variables

All dependencies are already installed and configured in the project. 