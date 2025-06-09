// app.js

const form = document.getElementById('applianceForm');
const deviceInput = document.getElementById('deviceInput');
const wattageInput = document.getElementById('wattageInput');
const hoursInput = document.getElementById('hoursInput');
const carbonFootprintDiv = document.getElementById('carbonFootprint');
const savingsTipsDiv = document.getElementById('savingsTips');

const costChartCtx = document.getElementById('costChart').getContext('2d');
const changeChartCtx = document.getElementById('changeChart').getContext('2d');
const usageChartCtx = document.getElementById('usageChart').getContext('2d');
const applianceChartCtx = document.getElementById('applianceChart').getContext('2d');
const energyChartCtx = document.getElementById('energyChart').getContext('2d');

let applianceData = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const device = deviceInput.value;
  const wattage = parseFloat(wattageInput.value);
  const hours = parseFloat(hoursInput.value);
  const usageKWh = ((wattage * hours) / 1000).toFixed(2);
  const carbon = (usageKWh * 0.5).toFixed(2);
  const cost = (usageKWh * 0.25).toFixed(2); // assume 0.25 AZN/kWh for default

  applianceData.push({ device, usageKWh: parseFloat(usageKWh), cost: parseFloat(cost) });
  updateCharts();

  carbonFootprintDiv.innerHTML = `Daily Carbon Footprint: <span class="highlight">${carbon} kg CO₂</span><br>Cost: <span class="highlight">${cost} AZN</span>`;

  generateTips(parseFloat(usageKWh));
  form.reset();
});

function generateTips(usage) {
  savingsTipsDiv.innerHTML = '<strong>Tips:</strong><ul>' +
    (usage > 2
      ? '<li>Use LED bulbs.</li><li>Run appliances during off-peak hours.</li><li>Unplug unused devices.</li>'
      : '<li>Great! Your usage is efficient.</li><li>Keep tracking to maintain savings.</li>') + '</ul>';
}

function updateCharts() {
  const labels = applianceData.map(item => item.device);
  const usageData = applianceData.map(item => item.usageKWh);
  const costData = applianceData.map(item => item.cost);

  new Chart(costChartCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Cost (AZN)',
        data: costData,
        backgroundColor: '#10b981'
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  new Chart(usageChartCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Usage (kWh)',
        data: usageData,
        backgroundColor: '#3b82f6'
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  new Chart(applianceChartCtx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: 'Appliances',
        data: usageData,
        backgroundColor: ['#34d399', '#60a5fa', '#fbbf24', '#f87171']
      }]
    },
    options: { responsive: true }
  });

  new Chart(energyChartCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Energy Intensity',
        data: usageData.map(v => v * 1.2),
        borderColor: '#f97316',
        fill: false
      }]
    },
    options: { responsive: true }
  });

  new Chart(changeChartCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Change in Cost',
        data: costData.map((c, i) => i === 0 ? 0 : (c - costData[i - 1]).toFixed(2)),
        borderColor: '#a78bfa',
        fill: false
      }]
    },
    options: { responsive: true }
  });
}
