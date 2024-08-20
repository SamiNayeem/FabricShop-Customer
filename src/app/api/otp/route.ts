// pages/api/sendOtp.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { sendOtpEmail } from '../../config/sendEmail';

interface SendOtpBody {
    email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email }: SendOtpBody = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email field' });
        }

        const emailSent = await sendOtpEmail(email);

        if (emailSent) {
            return res.status(200).json({ message: 'OTP sent successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to send OTP' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
