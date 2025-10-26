import express from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const router = express.Router();

async function sendThanks(to, name=''){
  try{
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      to,
      from: process.env.MAIL_FROM || 'PrestigeSites <noreply@prestigesites-online.com>',
      subject: 'תודה שפנית – PrestigeSites',
      html: `<p>שלום ${name}, תודה שפנית ל-PrestigeSites. נחזור אליך בהקדם.</p>`
    });
  }catch(e){}
}

router.post('/', async (req,res)=>{
  const { name, email, phone, businessType, message, source='website' } = req.body || {};
  if(!name || !email) return res.status(400).json({ error:'name_and_email_required' });
  const lead = await prisma.lead.create({ data:{ name, email, phone, businessType, message, source } });
  sendThanks(email, name).catch(()=>{});
  res.json({ ok:true, lead });
});

router.get('/', async (_req,res)=>{
  const leads = await prisma.lead.findMany({ orderBy:{ createdAt:'desc' } });
  res.json({ leads });
});

export default router;
