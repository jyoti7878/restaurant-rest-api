const endpoints = ['dishes', 'promotions', 'leaders'];

document.getElementById('load').addEventListener('click', async () => {
  await Promise.all(endpoints.map(loadEndpoint));
});

async function loadEndpoint(endpoint) {
  const target = document.getElementById(endpoint);
  target.textContent = 'Loading...';
  try {
    const response = await fetch(`/${endpoint}`);
    const data = await response.json();
    target.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    target.textContent = err.message;
  }
}
