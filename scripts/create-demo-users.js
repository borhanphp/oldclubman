const axios = require('axios');

// API base URL - update this to match your backend URL
// You can set this via environment variable or change it directly here
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost/oldclubman/public/api';

console.log('\n🔧 Configuration Check:');
console.log('━'.repeat(60));
console.log(`Environment API_URL: ${process.env.API_URL || 'not set'}`);
console.log(`Environment NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'not set'}`);
console.log(`Using API URL: ${API_BASE_URL}`);
console.log('━'.repeat(60) + '\n');

// Demo user data - 10 males and 10 females
const demoUsers = [
  // Male users
  {
    fname: 'John',
    last_name: 'Smith',
    contact_or_email: 'john.smith@demo.com',
    gender: 'male',
    birthYear: '1985',
    birthMonth: '3',
    birthDay: '15',
  },
  {
    fname: 'Michael',
    last_name: 'Johnson',
    contact_or_email: 'michael.johnson@demo.com',
    gender: 'male',
    birthYear: '1990',
    birthMonth: '7',
    birthDay: '22',
  },
  {
    fname: 'David',
    last_name: 'Williams',
    contact_or_email: 'david.williams@demo.com',
    gender: 'male',
    birthYear: '1988',
    birthMonth: '11',
    birthDay: '8',
  },
  {
    fname: 'James',
    last_name: 'Brown',
    contact_or_email: 'james.brown@demo.com',
    gender: 'male',
    birthYear: '1992',
    birthMonth: '5',
    birthDay: '30',
  },
  {
    fname: 'Robert',
    last_name: 'Davis',
    contact_or_email: 'robert.davis@demo.com',
    gender: 'male',
    birthYear: '1987',
    birthMonth: '9',
    birthDay: '12',
  },
  {
    fname: 'William',
    last_name: 'Miller',
    contact_or_email: 'william.miller@demo.com',
    gender: 'male',
    birthYear: '1991',
    birthMonth: '2',
    birthDay: '18',
  },
  {
    fname: 'Richard',
    last_name: 'Wilson',
    contact_or_email: 'richard.wilson@demo.com',
    gender: 'male',
    birthYear: '1989',
    birthMonth: '6',
    birthDay: '25',
  },
  {
    fname: 'Thomas',
    last_name: 'Moore',
    contact_or_email: 'thomas.moore@demo.com',
    gender: 'male',
    birthYear: '1993',
    birthMonth: '10',
    birthDay: '5',
  },
  {
    fname: 'Daniel',
    last_name: 'Taylor',
    contact_or_email: 'daniel.taylor@demo.com',
    gender: 'male',
    birthYear: '1986',
    birthMonth: '4',
    birthDay: '14',
  },
  {
    fname: 'Christopher',
    last_name: 'Anderson',
    contact_or_email: 'christopher.anderson@demo.com',
    gender: 'male',
    birthYear: '1994',
    birthMonth: '12',
    birthDay: '20',
  },
  
  // Female users
  {
    fname: 'Emma',
    last_name: 'Garcia',
    contact_or_email: 'emma.garcia@demo.com',
    gender: 'female',
    birthYear: '1990',
    birthMonth: '1',
    birthDay: '10',
  },
  {
    fname: 'Olivia',
    last_name: 'Martinez',
    contact_or_email: 'olivia.martinez@demo.com',
    gender: 'female',
    birthYear: '1992',
    birthMonth: '8',
    birthDay: '16',
  },
  {
    fname: 'Sophia',
    last_name: 'Rodriguez',
    contact_or_email: 'sophia.rodriguez@demo.com',
    gender: 'female',
    birthYear: '1988',
    birthMonth: '3',
    birthDay: '28',
  },
  {
    fname: 'Isabella',
    last_name: 'Hernandez',
    contact_or_email: 'isabella.hernandez@demo.com',
    gender: 'female',
    birthYear: '1991',
    birthMonth: '5',
    birthDay: '7',
  },
  {
    fname: 'Mia',
    last_name: 'Lopez',
    contact_or_email: 'mia.lopez@demo.com',
    gender: 'female',
    birthYear: '1989',
    birthMonth: '9',
    birthDay: '23',
  },
  {
    fname: 'Charlotte',
    last_name: 'Gonzalez',
    contact_or_email: 'charlotte.gonzalez@demo.com',
    gender: 'female',
    birthYear: '1993',
    birthMonth: '2',
    birthDay: '11',
  },
  {
    fname: 'Amelia',
    last_name: 'Wilson',
    contact_or_email: 'amelia.wilson@demo.com',
    gender: 'female',
    birthYear: '1987',
    birthMonth: '7',
    birthDay: '19',
  },
  {
    fname: 'Harper',
    last_name: 'Anderson',
    contact_or_email: 'harper.anderson@demo.com',
    gender: 'female',
    birthYear: '1994',
    birthMonth: '11',
    birthDay: '3',
  },
  {
    fname: 'Evelyn',
    last_name: 'Thomas',
    contact_or_email: 'evelyn.thomas@demo.com',
    gender: 'female',
    birthYear: '1986',
    birthMonth: '4',
    birthDay: '26',
  },
  {
    fname: 'Abigail',
    last_name: 'Jackson',
    contact_or_email: 'abigail.jackson@demo.com',
    gender: 'female',
    birthYear: '1995',
    birthMonth: '12',
    birthDay: '9',
  },
];

// Common password for all demo users
const DEMO_PASSWORD = 'Demo@123456';

async function createUser(userData) {
  try {
    const payload = {
      fname: userData.fname,
      last_name: userData.last_name,
      contact_or_email: userData.contact_or_email,
      birthYear: userData.birthYear,
      birthMonth: userData.birthMonth,
      birthDay: userData.birthDay,
      password: DEMO_PASSWORD,
      password_confirmation: DEMO_PASSWORD,
      keepSignedIn: false,
    };

    console.log(`Creating user: ${userData.fname} ${userData.last_name} (${userData.gender})...`);
    
    const response = await axios.post(`${API_BASE_URL}/client/regi`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false, // Set to false for Node.js script
      timeout: 10000, // 10 second timeout
    });

    console.log(`✅ Successfully created: ${userData.fname} ${userData.last_name}`);
    return { success: true, user: userData, data: response.data };
  } catch (error) {
    // Detailed error logging
    let errorMessage = 'Unknown error';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = JSON.stringify(error.response.data, null, 2);
      console.error(`❌ Failed to create ${userData.fname} ${userData.last_name}:`);
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server';
      console.error(`❌ Failed to create ${userData.fname} ${userData.last_name}: No response from server`);
      console.error(`   Request was made to: ${API_BASE_URL}/client/regi`);
      console.error(`   Check if backend is running and URL is correct`);
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
      console.error(`❌ Failed to create ${userData.fname} ${userData.last_name}: ${error.message}`);
    }
    
    return { success: false, user: userData, error: errorMessage };
  }
}

async function testConnection() {
  console.log('🔍 Testing API connection...');
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
      },
    }).catch(() => null);
    
    if (response) {
      console.log('✅ API is reachable\n');
      return true;
    } else {
      console.log('⚠️  Could not reach health endpoint, but will try registration endpoint\n');
      return true;
    }
  } catch (error) {
    console.log('⚠️  Could not verify API connection, but will proceed anyway\n');
    return true;
  }
}

async function createAllUsers() {
  console.log('🚀 Starting to create 20 demo users...\n');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log(`Registration Endpoint: ${API_BASE_URL}/client/regi`);
  console.log(`Default Password: ${DEMO_PASSWORD}\n`);
  
  // Test connection first
  await testConnection();
  
  console.log('═'.repeat(60));

  const results = {
    successful: [],
    failed: [],
  };

  // Create users one by one to avoid overwhelming the server
  for (let i = 0; i < demoUsers.length; i++) {
    const result = await createUser(demoUsers[i]);
    
    if (result.success) {
      results.successful.push(result.user);
    } else {
      results.failed.push(result);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully created: ${results.successful.length} users`);
  console.log(`❌ Failed: ${results.failed.length} users`);

  if (results.successful.length > 0) {
    console.log('\n✅ Successful Users:');
    results.successful.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.fname} ${user.last_name} (${user.gender}) - ${user.contact_or_email}`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Users:');
    results.failed.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.user.fname} ${result.user.last_name} - ${result.error}`);
    });
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n🔐 Login Credentials:');
  console.log(`Email: [any user email from above]`);
  console.log(`Password: ${DEMO_PASSWORD}`);
  console.log('\n✨ Demo users creation completed!\n');
}

// Run the script
createAllUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

