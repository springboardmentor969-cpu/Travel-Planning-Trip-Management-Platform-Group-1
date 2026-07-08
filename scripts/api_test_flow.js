const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

async function runTest() {
  console.log('=== TRIPNEST API FLOW TEST START ===\n');

  // Generate random email to avoid duplicate key issues if run multiple times
  const randomSuffix = Math.floor(Math.random() * 100000);
  const email = `testuser_${randomSuffix}@tripnest.local`;
  const password = 'Password123';
  const name = 'Test User';

  console.log(`Step 1: Registering new user: ${email}...`);
  let registerRes;
  try {
    registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name,
      email,
      password,
      passwordConfirm: password
    });
    console.log('  [OK] Registration successful.');
    console.log(`  User ID: ${registerRes.data.userId}`);
    console.log(`  Role: ${registerRes.data.role}`);
  } catch (err) {
    console.error('  [FAIL] Registration failed:', err.response?.data || err.message);
    process.exit(1);
  }

  const { token, userId } = registerRes.data;

  // Configure axios instance with Bearer token
  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('\nStep 2: Checking Dashboard for new user...');
  try {
    const dashboardRes = await client.get('/dashboard');
    console.log('  [OK] Dashboard retrieved successfully.');
    console.log('  Dashboard stats:', dashboardRes.data);
    
    // Check initial stats
    if (dashboardRes.data.numberOfTrips !== 0) {
      throw new Error(`Expected numberOfTrips to be 0, got ${dashboardRes.data.numberOfTrips}`);
    }
    if (parseFloat(dashboardRes.data.totalExpenses) !== 0) {
      throw new Error(`Expected totalExpenses to be 0, got ${dashboardRes.data.totalExpenses}`);
    }
  } catch (err) {
    console.error('  [FAIL] Dashboard check failed:', err.message);
    process.exit(1);
  }

  console.log('\nStep 3: Creating a new Trip...');
  let tripId;
  const tripPayload = {
    title: 'Summer Vacation',
    destination: 'Paris, France',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    budget: 5000.00,
    status: 'PLANNED',
    userId: userId
  };

  try {
    const tripRes = await client.post('/trips', tripPayload);
    tripId = tripRes.data.id;
    console.log('  [OK] Trip created successfully.');
    console.log('  Trip details:', tripRes.data);
    if (!tripId) throw new Error('Trip ID was not returned');
  } catch (err) {
    console.error('  [FAIL] Trip creation failed:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\nStep 4: Adding an itinerary day...');
  const itineraryPayload = {
    dayNumber: 1,
    title: 'Arrival and Settle In',
    description: 'Fly into CDG, check in at the hotel, dinner at a bistro.',
    tripId: tripId
  };

  try {
    const itRes = await client.post(`/trips/${tripId}/itinerary`, itineraryPayload);
    console.log('  [OK] Itinerary day added successfully.');
    console.log('  Itinerary details:', itRes.data);
  } catch (err) {
    console.error('  [FAIL] Adding itinerary day failed:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\nStep 5: Listing itinerary days...');
  try {
    const listItRes = await client.get(`/trips/${tripId}/itinerary`);
    console.log('  [OK] Itinerary list retrieved successfully.');
    console.log(`  Count: ${listItRes.data.length} day(s)`);
    if (listItRes.data.length !== 1) {
      throw new Error(`Expected 1 itinerary day, got ${listItRes.data.length}`);
    }
  } catch (err) {
    console.error('  [FAIL] Listing itinerary failed:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\nStep 6: Adding an expense...');
  const expensePayload = {
    category: 'Flights',
    amount: 1200.00,
    description: 'Round trip tickets',
    expenseDate: '2026-07-10',
    tripId: tripId
  };

  try {
    const expRes = await client.post(`/trips/${tripId}/expenses`, expensePayload);
    console.log('  [OK] Expense added successfully.');
    console.log('  Expense details:', expRes.data);
  } catch (err) {
    console.error('  [FAIL] Adding expense failed:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\nStep 7: Verifying dashboard calculations...');
  try {
    const dashRes = await client.get('/dashboard');
    console.log('  [OK] Dashboard stats retrieved.');
    console.log('  Dashboard stats:', dashRes.data);
    
    if (Number(dashRes.data.numberOfTrips) !== 1) {
      throw new Error(`Expected numberOfTrips to be 1, got ${dashRes.data.numberOfTrips}`);
    }
    if (parseFloat(dashRes.data.totalExpenses) !== 1200.00) {
      throw new Error(`Expected totalExpenses to be 1200.00, got ${dashRes.data.totalExpenses}`);
    }
    if (parseFloat(dashRes.data.budgetRemaining) !== 3800.00) {
      throw new Error(`Expected budgetRemaining to be 3800.00, got ${dashRes.data.budgetRemaining}`);
    }
  } catch (err) {
    console.error('  [FAIL] Dashboard calculations verification failed:', err.message);
    process.exit(1);
  }

  console.log('\nStep 8: Editing Trip budget to 6000.00...');
  const updatedTripPayload = {
    ...tripPayload,
    budget: 6000.00
  };

  try {
    const updateRes = await client.put(`/trips/${tripId}`, updatedTripPayload);
    console.log('  [OK] Trip updated successfully.');
    console.log('  Updated trip budget:', updateRes.data.budget);
  } catch (err) {
    console.error('  [FAIL] Updating trip failed:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\nStep 9: Verifying updated budget calculations...');
  try {
    const dashRes = await client.get('/dashboard');
    console.log('  [OK] Dashboard stats retrieved.');
    console.log('  Dashboard stats:', dashRes.data);
    
    if (parseFloat(dashRes.data.budgetRemaining) !== 4800.00) {
      throw new Error(`Expected budgetRemaining to be 4800.00, got ${dashRes.data.budgetRemaining}`);
    }
  } catch (err) {
    console.error('  [FAIL] Updated budget verification failed:', err.message);
    process.exit(1);
  }

  console.log('\nStep 10: Deleting the Trip...');
  try {
    await client.delete(`/trips/${tripId}`);
    console.log('  [OK] Trip deleted successfully.');
  } catch (err) {
    console.error('  [FAIL] Deleting trip failed:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\nStep 11: Verifying statistics reset on Dashboard...');
  try {
    const finalDashRes = await client.get('/dashboard');
    console.log('  [OK] Final dashboard stats retrieved.');
    console.log('  Dashboard stats:', finalDashRes.data);
    
    if (Number(finalDashRes.data.numberOfTrips) !== 0) {
      throw new Error(`Expected numberOfTrips to be 0 after deletion, got ${finalDashRes.data.numberOfTrips}`);
    }
    if (parseFloat(finalDashRes.data.totalExpenses) !== 0.00) {
      throw new Error(`Expected totalExpenses to be 0.00, got ${finalDashRes.data.totalExpenses}`);
    }
    if (parseFloat(finalDashRes.data.budgetRemaining) !== 0.00) {
      throw new Error(`Expected budgetRemaining to be 0.00, got ${finalDashRes.data.budgetRemaining}`);
    }
  } catch (err) {
    console.error('  [FAIL] Final verification failed:', err.message);
    process.exit(1);
  }

  console.log('\n=== ALL STEPS PASSED SUCCESSFULLY! ===');
}

runTest();
