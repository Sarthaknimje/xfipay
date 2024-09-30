document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');

    if (!requestId) {
        document.getElementById('payment-details').innerHTML = '<p class="error">Invalid payment request.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/payment-request/${requestId}`);
        const data = await response.json();

        if (data.success) {
            const { request, xfiPrice } = data;
            document.getElementById('payment-details').innerHTML = `
                <h2>Payment Request Details</h2>
                <p>Recipient: ${request.recipient}</p>
                <p>Amount: ${request.amount} XFI</p>
                <p>Description: ${request.description}</p>
                <p>Expires: ${new Date(request.expiration * 1000).toLocaleString()}</p>
                <p>Current XFI Price: $${xfiPrice.toFixed(2)}</p>
                <p>Total in USD: $${(request.amount * xfiPrice).toFixed(2)}</p>
                <button id="pay-button" ${request.paid ? 'disabled' : ''}>
                    ${request.paid ? 'Paid' : 'Pay Now'}
                </button>
            `;

            if (!request.paid) {
                document.getElementById('pay-button').addEventListener('click', () => initiatePayment(requestId));
            }
        } else {
            document.getElementById('payment-details').innerHTML = `<p class="error">Error: ${data.error}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('payment-details').innerHTML = '<p class="error">An error occurred. Please try again.</p>';
    }
});

const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "key",
                "type": "string"
            }
        ],
        "name": "getValue",
        "outputs": [
            {
                "internalType": "uint128",
                "name": "",
                "type": "uint128"
            },
            {
                "internalType": "uint128",
                "name": "",
                "type": "uint128"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getXFIPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_expiration",
                "type": "uint256"
            }
        ],
        "name": "createRequest",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_requestId",
                "type": "bytes32"
            }
        ],
        "name": "payRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "isPremiumUser",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function initiatePayment(requestId) {
    try {
        // Check if Web3 is injected by the browser (Mist/MetaMask)
        if (typeof window.ethereum !== 'undefined') {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Get the contract instance
            const contractAddress = '0x839ab2b5ECd70faB29a36C90C6CD3EfDE97E0eA7'; // Make sure this matches your deployed contract address
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Call the payRequest function
            const tx = await contract.payRequest(requestId);
            await tx.wait();

            // Payment successful
            document.getElementById('payment-details').innerHTML = '<p class="success">Payment successful!</p>';
        } else {
            document.getElementById('payment-details').innerHTML = '<p class="error">Please install MetaMask to make payments.</p>';
        }
    } catch (error) {
        console.error('Payment error:', error);
        document.getElementById('payment-details').innerHTML = `<p class="error">Payment failed: ${error.message}</p>`;
    }
}
