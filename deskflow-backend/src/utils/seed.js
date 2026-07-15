/**
 * Seeds two demo accounts so the login screen has something to authenticate
 * against. Run with: node src/utils/seed.js
 *
 * Demo credentials (also documented in README.md):
 *   employee@deskflow.io / password123
 *   admin@deskflow.io    / password123
 */
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const mongoose = require('mongoose');

async function seed() {
  await connectDB();

  const demoUsers = [
    { name: 'Alex Employee', email: 'employee@deskflow.io', password: 'password123', role: 'Employee' },
    { name: 'Sam Admin', email: 'admin@deskflow.io', password: 'password123', role: 'Admin' },
  ];

  for (const demo of demoUsers) {
    const existing = await User.findOne({ email: demo.email });
    if (existing) {
      console.log(`Skipping ${demo.email} — already exists`);
      continue;
    }
    await User.create(demo);
    console.log(`Created ${demo.role}: ${demo.email}`);
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
