import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateInvoicePDF } from '../utils/pdf.js';

const prisma = new PrismaClient();
const router = express.Router();

function totals(items, vatPercent=18){
  const subtotal = items.reduce((s,i)=> s + Number(i.amount || 0), 0);
  const vatAmount = subtotal * (vatPercent/100);
  const total = subtotal + vatAmount;
  return { subtotal, vatAmount, total };
}

router.post('/', async (req,res)=>{
  const { leadId, currency='ILS', lineItems=[], vatPercent=18 } = req.body;
  if(!leadId || !Array.isArray(lineItems) || lineItems.length===0) return res.status(400).json({ error:'leadId_and_lineItems_required' });
  const lead = await prisma.lead.findUnique({ where:{ id:Number(leadId) } });
  if(!lead) return res.status(404).json({ error:'lead_not_found' });

  const count = await prisma.invoice.count();
  const number = `PS-${new Date().getFullYear()}-${String(count+1).padStart(5,'0')}`;

  const { subtotal, vatAmount, total } = totals(lineItems, vatPercent);
  const inv = await prisma.invoice.create({ data:{ leadId: lead.id, number, currency, subtotal, vatPercent, vatAmount, total, lineItems } });
  const pdfPath = await generateInvoicePDF({ number, lead, currency, lineItems, subtotal, vatPercent, vatAmount, total });
  const updated = await prisma.invoice.update({ where:{ id:inv.id }, data:{ pdfPath } });
  res.json({ invoice: updated, pdfUrl: `/static/invoices/${number}.pdf` });
});

router.get('/', async (_req,res)=>{
  const invoices = await prisma.invoice.findMany({ orderBy:{ issuedAt:'desc' } });
  res.json({ invoices });
});

export default router;
