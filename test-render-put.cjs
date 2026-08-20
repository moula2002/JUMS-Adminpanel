const axios = require('axios');

async function testPut() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post('https://jums-sever.onrender.com/api/auth/login', {
      email: 'admin@jums.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('Login successful! Token:', token.substring(0, 10) + '...');

    // 2. PUT Profile
    console.log('Updating profile...');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('firstName', 'Test');
    form.append('lastName', 'User');
    form.append('email', 'admin@jums.com');
    form.append('bio', 'Hello world');

    const putRes = await axios.put('https://jums-sever.onrender.com/api/auth/profile', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('PUT Successful:', putRes.data);
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data);
      // Let's try to get the raw HTML if it's an express default error handler
      if (typeof err.response.data === 'string' && err.response.data.includes('<html')) {
         console.error('HTML Error matched');
         const match = err.response.data.match(/<pre>(.*?)<\/pre>/s);
         if (match) console.error('Stack trace:', match[1]);
      }
    } else {
      console.error('Network Error:', err.message);
    }
  }
}

testPut();
