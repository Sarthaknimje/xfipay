const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const express = require('express');
const bodyParser = require('body-parser');
const paymentRoutes = require('../backend/routes/paymentRoutes');
const connectDB = require('../backend/config/database');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', paymentRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment variables loaded:', process.env.PAYMENT_REQUEST_CONTRACT_ADDRESS ? 'Yes' : 'No');
});
