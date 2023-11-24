let budget = [];
const storedbudget = JSON.parse(localStorage.getItem('trip_budget')) || [];
budget.push(...storedbudget);

if (budget.length > 0) {
  actualizarTabla();
}

function Trip(origin, destination, preferences) {
  this.origin = origin;
  this.destination = destination;
  this.preferences = preferences;
  this.startTime = null;

  this.getDistance = function () {
    const R = 6371;
    const dLat = (this.destination.latitude - this.origin.latitude) * (Math.PI / 180);
    const dLon = (this.destination.longitude - this.origin.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.origin.latitude * (Math.PI / 180)) * Math.cos(this.destination.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  this.getGasCost = function () {
    const distance = this.getDistance();
    const gasCost = distance * this.preferences.costPerKilometer;
    return gasCost;
  };

  this.getTotalCost = function () {
    const gasCost = this.getGasCost();
    return gasCost + this.preferences.otherCosts;
  };
}

function showMessage(icon, text, timer) {
  Swal.fire({
    icon,
    text,
    showConfirmButton: false,
    timer,
  });
}

function validateInput(value, minValue = 0) {
  return Number.isFinite(value) && value >= minValue;
}

async function simulate() {
  const originSelect = document.getElementById('origin');
  const destinationSelect = document.getElementById('destination');
  const costPerKilometer = parseFloat(document.getElementById('costPerKilometer').value);
  const otherCosts = parseFloat(document.getElementById('otherCosts').value);
  const origin = JSON.parse(originSelect.value);
  const destination = JSON.parse(destinationSelect.value);

  if (!validateInput(costPerKilometer) || !validateInput(otherCosts)) {
    showMessage('error', 'Por favor, ingrese valores válidos para todos los datos requeridos', 2500);
    return;
  }

  if (origin.latitude == destination.latitude && origin.longitude == origin.longitude) {
    showMessage('error', 'El punto de origen y destino no puede ser el mismo', 2500);
    return;
  }

  const dollarExchangeRate = await getDollarExchangeRate();

  const preferences = { costPerKilometer, otherCosts, dollarExchangeRate };
  const trip = new Trip(origin, destination, preferences);

  const startTime = new Date();
  trip.startTime = startTime.toLocaleTimeString()
  const totalCost = trip.getTotalCost();
  const totalCostInDollars = totalCost / dollarExchangeRate;

  const text = `El costo total del viaje es de $${totalCost.toFixed(2)} pesos (aprox. $${totalCostInDollars.toFixed(2)} dólares)`;
  const viaje = [trip.startTime, costPerKilometer, otherCosts, totalCost.toFixed(2), totalCostInDollars.toFixed(2)];
  budget.push(viaje);

  showMessage('success', text, 2500);
  actualizarTabla();
}

function actualizarTabla() {
  const tabla = document.getElementById('consultaTableBody');
  tabla.innerHTML = '';

  budget.forEach((consulta) => {
    const fila = document.createElement('tr');
    consulta.forEach((dato, index) => {
      const celda = document.createElement('td');
      celda.textContent = (index === 0) ? dato : "$" + dato;
      fila.appendChild(celda);
    });
    tabla.appendChild(fila);
  });

  localStorage.setItem('trip_budget', JSON.stringify(budget));
}

async function getDollarExchangeRate() {
  try {
    const response = await fetch('https://criptoya.com/api/dolar/oficial');
    const data = await response.json();
    return data.oficial;
  } catch (error) {
    console.error('Error al obtener el valor del dólar:', error);
    throw error;
  }
}

document.getElementById('simulateBtn').addEventListener('click', simulate);
