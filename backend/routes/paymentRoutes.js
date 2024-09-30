const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const { getXFIPrice } = require('../services/priceService');
const PaymentRequest = require('../artifacts/contracts/PaymentRequest.sol/PaymentRequest.json');

const CONTRACT_ADDRESS = process.env.PAYMENT_REQUEST_CONTRACT_ADDRESS;
const PROVIDER_URL = process.env.CROSSFI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

console.log('CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
console.log('PROVIDER_URL:', PROVIDER_URL);
console.log('PRIVATE_KEY:', PRIVATE_KEY ? 'Set' : 'Not set');

if (!CONTRACT_ADDRESS || !PROVIDER_URL || !PRIVATE_KEY) {
    console.error('Missing required environment variables. Please check your .env file.');
    process.exit(1);
}

let provider, signer, contract;

try {
    provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
    signer = new ethers.Wallet(PRIVATE_KEY, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, PaymentRequest.abi, signer);
} catch (error) {
    console.error('Error initializing ethers objects:', error);
    process.exit(1);
}
// New routes
router.post('/create-payment-request-db', async (req, res) => {
    try {
        const { walletAddress, amount, description, expiryDate } = req.body;
        const paymentLink = `${process.env.FRONTEND_URL}/pay/${Date.now()}`;
        const paymentRequest = new PaymentRequest({
            walletAddress,
            amount,
            description,
            expiryDate,
            paymentLink,
        });
        await paymentRequest.save();
        const xfiPrice = await getXFIPrice();
        res.json({ success: true, paymentLink: paymentRequest.paymentLink, xfiPrice });
    } catch (error) {
        console.error('Error creating payment request:', error);
        res.status(500).json({ success: false, error: 'Error creating payment request' });
    }
});

router.get('/payment-details/:id', async (req, res) => {
    try {
        const paymentRequest = await PaymentRequest.findOne({ paymentLink: `${process.env.FRONTEND_URL}/pay/${req.params.id}` });
        if (!paymentRequest) {
            return res.status(404).json({ success: false, error: 'Payment request not found' });
        }
        res.json({ success: true, paymentRequest });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ success: false, error: 'Error fetching payment details' });
    }
});

router.post('/update-payment-status/:id', async (req, res) => {
    try {
        const paymentRequest = await PaymentRequest.findOneAndUpdate(
            { paymentLink: `${process.env.FRONTEND_URL}/pay/${req.params.id}` },
            { status: 'paid' },
            { new: true }
        );
        if (!paymentRequest) {
            return res.status(404).json({ success: false, error: 'Payment request not found' });
        }
        res.json({ success: true, paymentRequest });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ success: false, error: 'Error updating payment status' });
    }
});

module.exports = router;