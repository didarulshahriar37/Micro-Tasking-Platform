const axios = require('axios');

async function testApiRegister() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'API Test User',
            email: 'api' + Date.now() + '@example.com',
            password: 'Password123',
            role: 'worker',
            profileImage: 'https://via.placeholder.com/150'
        });

        console.log('Registration successful:');
        console.log(response.data);
    } catch (error) {
        console.error('Registration failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error message:', error.message);
        }
    }
}

testApiRegister();
