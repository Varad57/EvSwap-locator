document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const citySearch = document.getElementById('citySearch');
  const pincodeSearch = document.getElementById('pincodeSearch');
  const resultsContainer = document.getElementById('stationResults');
  const resultsSection = document.getElementById('resultsSection');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = registerForm.firstName.value;
    const lastName = registerForm.lastName.value;
    const email = registerForm.registerEmail.value;
    const password = registerForm.registerPassword.value;
    const confirm = registerForm.confirmPassword.value;
    if (password !== confirm) return alert("Passwords do not match");

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await res.json();
      alert(data.message);
      document.getElementById("registerModal").classList.add("hidden");
    } catch (err) {
      alert("Register error");
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      alert("Welcome " + data.user.first_name);
      document.getElementById("loginModal").classList.add("hidden");
    } catch (err) {
      alert("Login failed");
    }
  });

  searchBtn.addEventListener('click', async function () {
  const city = citySearch.value.trim();
  const pincode = pincodeSearch.value.trim();

  if (!city || !pincode) {
    alert('Enter both city and pincode');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/search-stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, pincode })
    });
    const stations = await res.json();
    
    renderStations(stations);
  } catch (err) {
    alert('Failed to fetch stations');
  }
});

function renderStations(stations) {
  const container = document.querySelector('.grid');
  container.innerHTML = ''; // Clear previous

  stations.forEach(station => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6';
    card.innerHTML = `
      <h3 class="text-lg font-bold text-gray-900">${station.name}</h3>
      <p class="text-gray-700 text-sm">${station.address}, ${station.city}, ${station.pincode}</p>
      <p class="text-gray-700 text-sm mt-2">Available Battery Types: ${station.battery_types}</p>
      <p class="text-gray-700 text-sm">Hours: ${station.open_hours}</p>
      <p class="text-gray-700 text-sm">Status: ${station.status}</p>
    `;
    container.appendChild(card);
  });
}});

