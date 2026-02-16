
const Razorpay = require('razorpay');
console.log('Razorpay loaded:', !!Razorpay);
try {
  const instance = new Razorpay({ key_id: 'test', key_secret: 'test' });
  console.log('Instance created:', !!instance);
} catch (e) {
  console.error('Error:', e.message);
}
