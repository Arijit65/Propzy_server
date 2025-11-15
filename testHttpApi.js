const http = require('http');

const postData = JSON.stringify({
  purpose: 'Sell',
  propertyType: 'Residential',
  propertySubType: 'Apartment',
  city: 'Mumbai',
  locality: 'Bandra',
  bedrooms: '3',
  bathrooms: '2',
  plotArea: '1500',
  expectedPrice: '1000000'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Status:', res.statusCode);
    console.log('✅ Response:', data);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();
