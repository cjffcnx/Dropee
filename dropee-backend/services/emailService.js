const { Resend } = require('resend');
const { RESEND_API_KEY, RESEND_FROM, BASE_URL } = require('../config/secrets');

const resend = new Resend(RESEND_API_KEY);

const sendEmail = async (to, downloadLinks, fileNames) => {
  if (!RESEND_API_KEY || !RESEND_FROM) {
    throw new Error('Missing RESEND_API_KEY or RESEND_FROM in environment variables');
  }

  const linkItems = downloadLinks
    .map(
      (link, i) =>
        `<li style="margin:8px 0;">
          <a href="${link}" style="color:#e94560;text-decoration:none;font-weight:600;">
            📄 ${fileNames[i] || 'File ' + (i + 1)}
          </a>
          <br/>
          <span style="color:#a0a0b0;font-size:13px;">${link}</span>
        </li>`
    )
    .join('');

  await resend.emails.send({
    from: RESEND_FROM,
    to,
    subject: '📦 Someone shared files with you via Dropee',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background:#0f0f23; margin:0; padding:0; }
            .container { max-width:600px; margin:40px auto; background:#1a1a2e; border-radius:16px; overflow:hidden; }
            .header { background:linear-gradient(135deg,#e94560,#0f3460); padding:32px; text-align:center; }
            .header h1 { color:#fff; margin:0; font-size:32px; letter-spacing:2px; }
            .header p { color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:15px; }
            .body { padding:32px; color:#eaeaea; }
            .body h2 { color:#e94560; font-size:18px; margin-top:0; }
            .links { list-style:none; padding:0; margin:16px 0; }
            .footer { background:#16213e; padding:20px 32px; text-align:center; color:#a0a0b0; font-size:13px; }
            .note { background:#16213e; border-left:3px solid #e94560; padding:12px 16px; border-radius:0 8px 8px 0; margin-top:24px; font-size:14px; color:#a0a0b0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💧 Dropee</h1>
              <p>Drop it. Share it.</p>
            </div>
            <div class="body">
              <h2>You've received files!</h2>
              <p>Someone shared the following files with you. Click the links below to download them:</p>
              <ul class="links">${linkItems}</ul>
              <div class="note">
                ⏰ <strong>Note:</strong> These download links will expire in <strong>15 days</strong>.
              </div>
            </div>
            <div class="footer">
              Sent via <strong>Dropee</strong> — Fast, anonymous file sharing<br/>
              <a href="${BASE_URL}" style="color:#e94560;">${BASE_URL}</a>
            </div>
          </div>
        </body>
      </html>
    `,
  });
};

module.exports = { sendEmail };
