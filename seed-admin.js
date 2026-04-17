const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/notexhub';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  blocked: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await User.findOneAndUpdate(
    { email: 'admin@notexhub.com' },
    { 
      name: 'Admin User', 
      email: 'admin@notexhub.com', 
      password: hashedPassword, 
      role: 'admin' 
    },
    { upsert: true }
  );

  console.log('Admin user created successfully!');
  console.log('Email: admin@notexhub.com');
  console.log('Password: password123');
  mongoose.connection.close();
}

seedAdmin().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
