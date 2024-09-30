const axios = require('axios');

const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
const BLAST_API_KEY = process.env.BLAST_API_KEY;

async function getXFIPrice() {
    try {
        // Try Covalent API first
        const covalentResponse = await axios.get(`https://api.covalenthq.com/v1/pricing/tickers/?tickers=XFI&key=${COVALENT_API_KEY}`);
        if (covalentResponse.data && covalentResponse.data.data && covalentResponse.data.data.items && covalentResponse.data.data.items.length > 0) {
            return covalentResponse.data.data.items[0].quote_rate;
        }
    } catch (error) {
        console.error('Error fetching price from Covalent:', error);
    }

    try {
        // Fallback to Blast API
        const blastResponse = await axios.get(`https://api.blastapi.io/tokens/XFI/price?api_key=${BLAST_API_KEY}`);
        if (blastResponse.data && blastResponse.data.price) {
            return blastResponse.data.price;
        }
    } catch (error) {
        console.error('Error fetching price from Blast:', error);
    }

    throw new Error('Unable to fetch XFI price');
}

module.exports = {
    getXFIPrice
};
