require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Config (set these as environment variables when you deploy) ---
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'; // Resend's shared sending domain (no custom domain verification needed)
const CLINIC_NAME = process.env.CLINIC_NAME || "Ahuja's Dental Clinic";
const GOOGLE_REVIEW_LINK = process.env.GOOGLE_REVIEW_LINK || 'https://maps.app.goo.gl/ZjZBQtgkdJGmQPDb6';

if (!RESEND_API_KEY) {
  console.warn('WARNING: RESEND_API_KEY is not set. Emails will fail to send until you set it.');
}

const resend = new Resend(RESEND_API_KEY);

app.use(express.json());
app.use(express.static('public'));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.post('/api/send-review', async (req, res) => {
  try {
    const { patientEmail, patientName } = req.body;

    if (!patientEmail || !isValidEmail(patientEmail)) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid patient email address.' });
    }

    const safeName = patientName && patientName.trim() ? escapeHtml(patientName.trim()) : null;
    const greeting = safeName ? `Hi ${safeName},` : 'Hi,';

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
        <p style="font-size: 16px;">${greeting}</p>
        <p style="font-size: 16px; line-height: 1.5;">
          Thank you for visiting <strong>${escapeHtml(CLINIC_NAME)}</strong>! We hope you're doing well after your treatment.
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          If you have a moment, we'd really appreciate it if you could share your experience with a quick Google review. It helps us a lot and only takes a minute.
        </p>
        <p style="text-align: center; margin: 28px 0;">
          <a href="${GOOGLE_REVIEW_LINK}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; display: inline-block;">
            Leave a Google Review
          </a>
        </p>
        <p style="font-size: 14px; color: #6b7280;">
          Thank you for trusting us with your care.<br/>
          — Team ${escapeHtml(CLINIC_NAME)}
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: patientEmail,
      subject: `Thank you from ${CLINIC_NAME} — would you share a review?`,
      html
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return res.status(502).json({ ok: false, error: 'Resend could not send the email. Check server logs.' });
    }

    return res.json({ ok: true, id: result.data && result.data.id });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong on the server.' });
  }
});

app.listen(PORT, () => {
  console.log(`Review tool running at http://localhost:${PORT}`);
});
