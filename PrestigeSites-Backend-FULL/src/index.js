import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import leadsRouter from './routes/leads.js';
import invoicesRouter from './routes/invoices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 60*1000, max: 120 }));

app.get('/api/health', (req,res)=> res.json({ ok:true, time:new Date().toISOString() }));

app.use('/api/leads', leadsRouter);
app.use('/api/invoices', invoicesRouter);

app.use('/static', express.static(path.join(__dirname, '..', 'static')));

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log('PrestigeSites Backend running on port', port));
