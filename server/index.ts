import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ Add this for frontend-backend connection
import geminiRouter from './routes/geminiChat';

dotenv.config();

const app = express();

app.use(cors()); // ✅ Allow requests from your frontend
app.use(express.json());

app.use('/chat', geminiRouter); // ✅ Route for Gemini chat

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
