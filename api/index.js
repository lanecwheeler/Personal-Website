import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*'}));
app.use(express.json());

// Email endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message, selectedFavorite } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: 'lanecwheeler@gmail.com',
        subject: `New message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}\n\nFavorite: ${selectedFavorite}`,
    });

    if (error) {
        console.error('Resend error:', error)
        return res.status(500).json({ error: 'Failed to send email' })
    }

    res.json({ success: true });
});

app.listen(3000, () => console.log('API listening - Port 3000'));