const emailService = require('../services/email.service');

/**
 * Test email service functionality
 */
const testEmailService = async () => {
  console.log('Testing email service...');
  
  try {
    // Test 1: Send a test email
    console.log('Sending test email...');
    await emailService.sendEmail({
      to: 'vijaykumar@gmail.com',
      subject: 'HR Mail Hub - Email Service Test',
      text: 'This is a test email from HR Mail Hub email service.',
      html: `
        <h1>Email Service Test</h1>
        <p>This is a test email from HR Mail Hub email service.</p>
        <p>If you receive this, the email service is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    
    // Test 2: Send welcome email
    console.log('Sending welcome email test...');
    await emailService.sendWelcomeEmail({
      email: 'vijaykumar@gmail.com',
      name: 'Test User',
      password: 'TestPass123'
    });
    
    console.log('✅ Welcome email test sent successfully!');
    
    // Test 3: Send password reset email
    console.log('Sending password reset email test...');
    await emailService.sendPasswordResetEmail({
      email: 'vijaykumar@gmail.com',
      name: 'Test User',
      resetToken: 'test-token-123',
      resetUrl: 'http://localhost:3000/reset-password?token=test-token-123'
    });
    
    console.log('✅ Password reset email test sent successfully!');
    
    // Test 4: Send resume submission email
    console.log('Sending resume submission email test...');
    await emailService.sendResumeSubmissionEmail({
      email: 'vijaykumar@gmail.com',
      name: 'Test User',
      resumeName: 'test_resume.pdf'
    });
    
    console.log('✅ Resume submission email test sent successfully!');
    
    console.log('🎉 All email service tests passed!');
    
  } catch (error) {
    console.error('❌ Email service test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  testEmailService();
}

module.exports = testEmailService;
