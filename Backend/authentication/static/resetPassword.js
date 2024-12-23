// resetPassword.js

document.getElementById('resetButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    if (!password || !confirmPassword) {
      alert('All fields are required.');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.18.164:5000/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
  
      const result = await response.text();
      if (response.ok) {
        alert(result);
      } else {
        alert('Error: ' + result);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while resetting your password.');
    }
  });
  