const mongoose = require('mongoose');

const paymentRequestSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, default: 'pending' },
    paymentLink: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PaymentRequest', paymentRequestSchema);
