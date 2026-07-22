# Ahuja's Dental Clinic — Review Request Tool

A one-page tool for the doctor or staff: enter the treated patient's email, click **Send Review Request**, and the patient automatically receives a short thank-you email with a link to leave a Google review — sent via the Resend API.

The Resend API key stays on the server and is never exposed in the browser.

---

## 1. What's in this folder

```
review-tool/
├── server.js         → Express server + Resend integration (the API key lives here)
├── public/
│   └── index.html    → The form staff will use
├── package.json
├── .env.example       → Template for your secret config
└── README.md
```

## 2. Sending address

This is configured to send from Resend's shared domain (`onboarding@resend.dev`), so no custom domain setup is required to get started. If you ever notice emails landing in spam or want the sender to show your clinic's own domain, you can verify a domain in your Resend dashboard later and update `FROM_EMAIL` in `.env` — but it's not required to run this tool.

## 3. Configure your secrets

Copy the example env file and fill it in:

```bash
cp .env.example .env
```

Edit `.env`:

```
RESEND_API_KEY=re_your_actual_key
FROM_EMAIL=reviews@ahujasdental.com
CLINIC_NAME=Ahuja's Dental Clinic
GOOGLE_REVIEW_LINK=https://maps.app.goo.gl/ZjZBQtgkdJGmQPDb6
```

**Never share this `.env` file or commit it to GitHub.** It contains your live API key.

## 4. Run it locally (to test)

```bash
npm install
npm start
```

Then open `http://localhost:3000` in your browser, enter a test email, and click send.

## 5. Deploy it so your staff can use it

Any host that supports Node.js and environment variables works. Easiest options:

**Render.com (free tier available)**
1. Push this folder to a GitHub repo.
2. On Render, create a new "Web Service" from that repo.
3. Build command: `npm install`  Start command: `npm start`
4. Add your `.env` values under Render's "Environment" tab (not as a file — paste each key/value).
5. Deploy. Render gives you a public URL — bookmark it on the clinic computer/tablet.

**Vercel or Railway** work similarly — connect the repo, add the same environment variables in their dashboard, deploy.

Once deployed, staff just open the URL, enter the patient's email, and click send — no login or setup needed on their end.

## 6. How it works, in short

1. Staff fills in the patient's email (and optionally their name) and clicks **Send Review Request**.
2. The browser sends that to your server's `/api/send-review` endpoint.
3. The server calls Resend's API using your secret key, sending a short thank-you email with your Google review link to the patient.
4. The staff member sees an on-screen confirmation ("Review request sent to ...") or a clear error if something failed.

## 7. Customizing the email

Open `server.js` and look for the `html` template inside the `/api/send-review` route — you can edit the wording, colors, or add your clinic logo there.
