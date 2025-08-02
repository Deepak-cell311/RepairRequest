# SendGrid Template Troubleshooting Guide

## Current Issue
The email service is receiving a 403 Forbidden error when trying to send templated emails. This indicates a configuration or permission issue with SendGrid.

## Error Analysis
```
ResponseError: Forbidden
code: 403
```

## Possible Causes and Solutions

### 1. API Key Permissions
**Issue**: The SendGrid API key might not have the necessary permissions.

**Solution**:
- Log into your SendGrid account
- Go to Settings > API Keys
- Ensure your API key has "Full Access" or at least "Mail Send" permissions
- If using a restricted key, make sure it includes template access

### 2. Template Access
**Issue**: The template IDs might not be accessible with the current API key.

**Solution**:
- Verify template IDs exist in your SendGrid account
- Check if templates are shared with your account (if using sub-accounts)
- Ensure templates are published and active

### 3. Sender Verification
**Issue**: The `from` email address might not be verified.

**Solution**:
- In SendGrid, go to Settings > Sender Authentication
- Verify your domain or at least the sender email
- The current sender is: `notifications@schoolhouselogistics.com`

### 4. Template Variable Mismatch
**Issue**: Template variables might not match between code and template.

**Current Variables Being Sent**:
```json
{
  "requester_name": "John Doe",
  "request_id": 24,
  "request_type": "building",
  "title": "Test Request",
  "description": "Test description",
  "priority": "medium",
  "priority_upper": "MEDIUM",
  "location": "Main building",
  "building": "Main building",
  "room_number": "1002",
  "requester_email": "requester@test.com",
  "organization_name": "New User Demo",
  "submitted_date": "8/2/2025",
  "submitted_time": "4:57:11 PM",
  "has_building": true,
  "has_room": true,
  "priority_class": "priority-medium",
  "location_info": "Main building, Room 1002"
}
```

**Template Variables Should Be**:
- In the template: `{{requester_name}}`
- In the code: `requester_name` (without braces)

## Testing Steps

### 1. Test API Key
```bash
# Run the test script
node test-sendgrid-template.js
```

### 2. Verify Template in SendGrid
1. Log into SendGrid
2. Go to Dynamic Templates
3. Find template ID: `d-06a18cd247d04f51a3ef5d815c4a84ab`
4. Check if it contains the variable `{{requester_name}}`

### 3. Check Template Variables
Ensure your SendGrid template uses these exact variable names:
- `{{requester_name}}`
- `{{request_id}}`
- `{{request_type}}`
- `{{title}}`
- `{{description}}`
- `{{priority}}`
- `{{priority_upper}}`
- `{{location}}`
- `{{building}}`
- `{{room_number}}`
- `{{requester_email}}`
- `{{organization_name}}`
- `{{submitted_date}}`
- `{{submitted_time}}`
- `{{has_building}}`
- `{{has_room}}`
- `{{priority_class}}`
- `{{location_info}}`

## Environment Variables Check
Verify these are set correctly in your `.env` file:
```
SENDGRID_API_KEY=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
SENDGRID_FROM_EMAIL=notifications@schoolhouselogistics.com
SENDGRID_REQUESTER_TEMPLATE_ID=d-06a18cd247d04f51a3ef5d815c4a84ab
SENDGRID_ADMIN_TEMPLATE_ID=d-350141c85514463b885f6fcf3f4a44f9
```

## Fallback Solution
If templates continue to fail, the system will automatically fall back to sending inline HTML emails. This ensures email notifications still work while you resolve the template issues.

## Next Steps
1. Run the test script to identify the specific issue
2. Check SendGrid account permissions and template access
3. Verify sender authentication
4. Update template variables if needed
5. Test with a simple template first before using complex ones 