// sendOTP.js

// Mock SMS sending function for development
// In production, this would integrate with Twilio or another SMS provider

export const sendSMS = async (to, message) => {
  try {
    // In production, use actual SMS service like Twilio
    if (process.env.NODE_ENV === 'production') {
      // This would be the actual Twilio implementation
      // const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      // await client.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: to
      // });
      console.log(`[PRODUCTION] Would send SMS to ${to}: ${message}`);
    } else {
      // In development, just log the message
      console.log(`[DEVELOPMENT] SMS to ${to}: ${message}`);
      console.log(`📱 OTP for ${to}: ${message}`);
    }
    
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    console.error('SMS sending error:', error);
    
    // Even if SMS fails, we still want to proceed in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`⚠️  SMS failed, but continuing in development mode. OTP would be: ${message}`);
      return { success: true, message: 'Development mode - SMS simulated' };
    }
    
    throw new Error('Failed to send SMS');
  }
};

// Alternative: Simple SMS function without dependencies
export const sendSimpleSMS = async (phoneNumber, otpCode) => {
  const message = `Your DugOut verification code is: ${otpCode}. This code expires in 10 minutes.`;
  
  console.log(`🔐 OTP Verification:`);
  console.log(`   To: ${phoneNumber}`);
  console.log(`   Code: ${otpCode}`);
  console.log(`   Message: ${message}`);
  console.log(`   ⏰ Expires: 10 minutes`);
  
  return { success: true, code: otpCode };
};

export default { sendSMS, sendSimpleSMS };