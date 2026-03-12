const twilio = require('twilio');
const { TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER } = require('../config/secrets');

const sendSMS = async (to, downloadLink) => {
  const client = twilio(TWILIO_SID, TWILIO_TOKEN);

  await client.messages.create({
    body: `💧 Dropee: Someone shared files with you! Download here: ${downloadLink}\n\nThis link expires in 15 days.`,
    from: TWILIO_NUMBER,
    to,
  });
};

module.exports = { sendSMS };
