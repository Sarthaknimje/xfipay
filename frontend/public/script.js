document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const walletAddress = document.getElementById('walletAddress').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const expiryDate = document.getElementById('expiryDate').value;
  
    if (!walletAddress || !amount || !description || !expiryDate) {
      document.getElementById('result').innerHTML = '<p class="error">Please fill out all fields.</p>';
      return;
    }
  
    try {
      const response = await fetch('/api/create-payment-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, amount, description, expiryDate }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.success) {
        document.getElementById('result').innerHTML = `
          <p class="success">Payment link created successfully!</p>
          <p><a href="${data.paymentLink}" target="_blank">${data.paymentLink}</a></p>
          <p>Current XFI Price: $${data.xfiPrice.toFixed(2)}</p>
        `;
      } else {
        document.getElementById('result').innerHTML = `<p class="error">Error: ${data.error}</p>`;
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = '<p class="error">An error occurred. Please try again.</p>';
    }
  });
  