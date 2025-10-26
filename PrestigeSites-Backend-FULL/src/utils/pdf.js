import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export async function generateInvoicePDF({ number, lead, currency='ILS', lineItems=[], subtotal, vatPercent=18, vatAmount, total }){
  const dir = path.join(process.cwd(), 'static', 'invoices');
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${number}.pdf`);

  const doc = new PDFDocument({ size:'A4', margin: 50 });
  doc.fontSize(22).fillColor('#d4af37').text('PrestigeSites – קבלה/חשבונית', { align:'right' });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#000').text(`מספר: ${number}`, { align:'right' });
  doc.text(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, { align:'right' });
  doc.moveDown();
  doc.text(`אל: ${lead.name} <${lead.email}>`, { align:'right' });
  if (lead.phone) doc.text(`טלפון: ${lead.phone}`, { align:'right' });
  doc.moveDown();
  doc.text('פריטים:', { align:'right' });
  lineItems.forEach((li, idx)=> doc.text(`${idx+1}. ${li.description} – ${li.amount} ${currency}`, { align:'right' }));
  doc.moveDown();
  doc.text(`לפני מע״מ: ${subtotal.toFixed(2)} ${currency}`, { align:'right' });
  doc.text(`מע״מ (${vatPercent}%): ${vatAmount.toFixed(2)} ${currency}`, { align:'right' });
  doc.text(`לתשלום: ${total.toFixed(2)} ${currency}`, { align:'right', underline:true });

  doc.pipe(fs.createWriteStream(filePath));
  doc.end();
  await new Promise(r=>setTimeout(r,300));
  return filePath;
}
