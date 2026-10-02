# Ahuja Dental Clinic — Patient Thank-You Tool

Frontend-only WhatsApp click-to-chat utility. It does not use Firebase, a database, a backend, WhatsApp API, or API keys.

## Run
Open index.html in a browser, or serve the folder with any static web server.

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Deploy with no build command and no environment variables.

## How sending works
The tool normalizes the Indian mobile number and creates a URL in the form:
https://wa.me/91XXXXXXXXXX?text=...
WhatsApp then opens with the message prefilled. The staff member manually presses Send.

No patient information is persisted by the application.