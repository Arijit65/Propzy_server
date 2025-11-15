// Simple test to verify API endpoint is working
const testPropertyCreation = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purpose: 'Sell',
        propertyType: 'Residential',
        propertySubType: 'House',
        city: 'Test City',
        locality: 'Test Locality',
        bedrooms: '2',
        bathrooms: '1',
        plotArea: '1000',
        expectedPrice: '500000'
      })
    });

    const data = await response.json();
    console.log('✅ Response Status:', response.status);
    console.log('✅ Response Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testPropertyCreation();
