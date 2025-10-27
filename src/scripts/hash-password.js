// hash-password.js
import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the password to hash: ', async (password) => {
  try {
    const hashed = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashed);
  } catch (error) {
    console.error('Error hashing password:', error);
  } finally {
    rl.close();
  }
});