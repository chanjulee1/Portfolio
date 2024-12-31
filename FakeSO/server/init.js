const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin.js');
const User = require('./models/User.js');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/fake_so', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const adminUsername = process.argv[2] || 'admin';
const adminPassword = process.argv[3] || 'adminpassword';

const adminSalt = bcrypt.genSaltSync(10);
const hashedAdminPassword = bcrypt.hashSync(adminPassword, adminSalt);

const adminProfile = {
  username: adminUsername,
  email: 'admin@example.com',
  password: hashedAdminPassword,
  reputation: 100000,
};

// User creation
const dummyUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpassword',
  reputation: 60,
};

const userSalt = bcrypt.genSaltSync(10);
const hashedUserPassword = bcrypt.hashSync(dummyUser.password, userSalt);
dummyUser.password = hashedUserPassword;

Promise.all([
  Admin.create(adminProfile),
  User.create(dummyUser),
])
  .then(() => {
    console.log('Admin and dummy user profiles created successfully.');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error creating profiles:', err);
    mongoose.connection.close();
  });
