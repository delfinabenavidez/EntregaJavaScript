// Definimos una estructura de datos para representar el viaje
class Trip {
  constructor(origin, destination, preferences) {
    this.origin = origin;
    this.destination = destination;
    this.preferences = preferences;
    this.startTime = null;
  }

  // Obtiene la distancia en línea recta entre dos puntos
  getDistance() {
    const lat1 = this.origin.latitude;
    const lon1 = this.origin.longitude;
    const lat2 = this.destination.latitude;
    const lon2 = this.destination.longitude;

    // Fórmula de la distancia en línea recta (fórmula de Haversine)
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en kilómetros

    return distance;
  }

  // Calcula el costo del viaje en gasolina
  getGasCost() {
    const distance = this.getDistance();
    const gasCost = distance * this.preferences.costPerKilometer;
    return gasCost;
  }

  // Calcula el costo total del viaje (solo gasto en gasolina)
  getTotalCost() {
    const gasCost = this.getGasCost();
    return gasCost + this.preferences.otherCosts; // Puedes agregar otros costos aquí
  }

  // Devuelve una representación JSON del viaje
  toJSON() {
    return {
      origin: this.origin,
      destination: this.destination,
      preferences: this.preferences,
    };
  }

  // Inicia el viaje
  start() {
    this.startTime = new Date();
  }
}

// Definimos una función para simular el viaje
function simulate() {
  try {
    // Obtenemos los datos del viaje del usuario
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const costPerKilometer = parseFloat(document.getElementById('costPerKilometer').value);
    const otherCosts = parseFloat(document.getElementById('otherCosts').value);

    // Validamos los datos del viaje
    if (isNaN(costPerKilometer) || isNaN(otherCosts)) {
      // Mostramos un mensaje de error al usuario
      alert('Por favor, ingrese todos los datos requeridos de manera válida');
      return;
    }

    const origin = JSON.parse(originSelect.value);
    const destination = JSON.parse(destinationSelect.value);

    // Creamos un nuevo viaje
    const preferences = { costPerKilometer, otherCosts };
    const trip = new Trip(origin, destination, preferences);

    // Iniciamos el viaje
    trip.start();

    // Calculamos el costo total del viaje (solo gasto en gasolina)
    const totalCost = trip.getTotalCost();

    // Mostramos el resultado al usuario
    alert(`El costo total del viaje es de ${totalCost.toFixed(2)} pesos (solo gasto en gasolina)`);
  } catch (error) {
    console.error(error);
  }
}

// Evento para simular el viaje al hacer clic en un botón (debes tener un botón en tu HTML con el id "simulateBtn")
document.getElementById('simulateBtn').addEventListener('click', simulate);
