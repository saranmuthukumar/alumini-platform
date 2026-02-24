

const login = async () => {
    try {
        console.log('Testing Login with Student Credentials...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'student1@university.edu',
                password: 'Student@123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.status === 200) {
            console.log('✅ Login Successful');
        } else {
            console.log('❌ Login Failed');
        }
    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
};

login();
