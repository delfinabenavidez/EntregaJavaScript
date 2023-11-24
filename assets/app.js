// Budget para los datos y su almacenamiento 
let budget = [];
// Recuperamos datos almacenados en localStorage o como vacio si no hay nada
const storedbudget = JSON.parse(localStorage.getItem('trip_budget')) || [];
budget.push(...storedbudget);

if (budget.length > 0) {
  actualizarTabla();
}

function Trip(origin, destination, preferences) {
   // Propiedades del viaje
  this.origin = origin;
  this.destination = destination;
  this.preferences = preferences;
  this.startTime = null;

 // Calcular la distancia entre el origen y el destino
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
 // Calcular el costo de la gasolina basado en la distancia y el costo por kilometro.
  this.getGasCost = function () {
    const distance = this.getDistance();
    const gasCost = distance * this.preferences.costPerKilometer;
    return gasCost;
  };
// Costo total del viaje 
  this.getTotalCost = function () {
    const gasCost = this.getGasCost();
    return gasCost + this.preferences.otherCosts;
  };
}
// Usamos la libreria SweetAlert2 para mostrar mensajes
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
  // Obtención de elementos del formulario.
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
// Verificamos que el origen y el destino no sean los mismos.
  if (origin.latitude == destination.latitude && origin.longitude == origin.longitude) {
    showMessage('error', 'El punto de origen y destino no puede ser el mismo', 2500);
    return;
  }
// Tipo de cambio del dólar.
  const dollarExchangeRate = await getDollarExchangeRate();
 // Trip con preferencias y detalles
  const preferences = { costPerKilometer, otherCosts, dollarExchangeRate };
  const trip = new Trip(origin, destination, preferences);
  // Registro del tiempo de inicio del viaje.
  const startTime = new Date();
  trip.startTime = startTime.toLocaleTimeString()
  //Obtenemos el costo total del viaje en pesos y dolares
  const totalCost = trip.getTotalCost();
  const totalCostInDollars = totalCost / dollarExchangeRate;

  const text = `El costo total del viaje es de $${totalCost.toFixed(2)} pesos (aprox. $${totalCostInDollars.toFixed(2)} dólares)`;
  const viaje = [trip.startTime, costPerKilometer, otherCosts, totalCost.toFixed(2), totalCostInDollars.toFixed(2)];
  budget.push(viaje);

  showMessage('success', text, 2500);
  actualizarTabla();
}
// Actualiza la tabla con los datos actuales
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
// Funcion asincronica para obtener el tipo de cambio del dolar desde una API.
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
