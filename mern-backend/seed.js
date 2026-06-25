const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ivtms_db');
    console.log('Connected to MongoDB');

    const usersToSeed = [
      {
        fullName: 'Citizen User',
        email: 'citizen_new@ivtms.com',
        password: 'password123',
        aadhaarNumber: '100010001000',
        role: 'CITIZEN'
      },
      {
        fullName: 'System Admin',
        email: 'admin_new@ivtms.com',
        password: 'password123',
        aadhaarNumber: '200020002000',
        role: 'ADMIN'
      },
      {
        fullName: 'RTO Officer',
        email: 'rto_new@ivtms.com',
        password: 'password123',
        aadhaarNumber: '300030003000',
        role: 'RTO'
      },
      {
        fullName: 'Field Inspector',
        email: 'inspector_new@ivtms.com',
        password: 'password123',
        aadhaarNumber: '400040004000',
        role: 'INSPECTOR'
      }
    ];

    for (let userData of usersToSeed) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`Created ${userData.role} user: ${userData.email}`);
      } else {
        console.log(`${userData.role} user already exists: ${userData.email}`);
      }
    }

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
