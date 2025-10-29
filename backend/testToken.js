import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not loaded.");

const testUserId = "671c0d83e2f15b998acbbf11"; // replace with a real user ID from MongoDB

const token = jwt.sign({ userId: testUserId }, JWT_SECRET, { expiresIn: '30d' });

console.log("✅ New Token:");
console.log(token);

const verified = jwt.verify(token, JWT_SECRET);
console.log("✅ Verified Token Payload:", verified);
