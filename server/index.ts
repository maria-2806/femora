import express from 'express';
import sendReportRoute from './routes/sendReport';
import dotenv from 'dotenv';
import cors from 'cors'; 
import geminiRouter from './routes/geminiChat';

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json());

app.use('/chat', geminiRouter); 
app.use('/api/send', sendReportRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
