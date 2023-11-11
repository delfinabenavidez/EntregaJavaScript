// Importamos las librerías necesarias
import TweenMax from 'gsap';
import L from 'leaflet';

// Definimos una estructura de datos para representar el viaje
class Trip {
  constructor(origin, destination, preferences) {
    this.origin = origin;
    this.destination = destination;
    this.preferences = preferences;
    this.startTime = null;
  }

  // Obtiene la ruta del viaje
  async getRoute() {
    try {
      // Obtenemos los datos del viaje de una API utilizando fetch
      const response = await fetch('https://api.example.com/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.toJSON()),
      });

      if (!response.ok) {
        throw new Error('Error al obtener la ruta del viaje');
      }

      // Decodificamos los datos
      const data = await response.json();

      // Devolvemos la ruta
      return data.route;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Devuelve la duración del viaje
  getDuration() {
    // Obtenemos la ruta del viaje de forma asincrónica
    return this.getRoute().then(route => route.length / this.preferences.speed);
  }

  // Devuelve el costo del viaje
  getCost() {
    // Obtenemos la ruta del viaje de forma asincrónica
    return this.getRoute().then(route => route.length * this.preferences.costPerMile);
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
async function simulate() {
  try {
    // Obtenemos los datos del viaje del usuario
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const speed = parseFloat(document.getElementById('speed').value);
    const costPerMile = parseFloat(document.getElementById('costPerMile').value);

    // Validamos los datos del viaje
    if (!origin || !destination || isNaN(speed) || isNaN(costPerMile)) {
      // Mostramos un mensaje de error al usuario
      alert('Por favor, ingrese todos los datos requeridos de manera válida');
      return;
    }

    // Creamos un nuevo viaje
    const preferences = { speed, costPerMile };
    const trip = new Trip(origin, destination, preferences);

    // Iniciamos el viaje
    trip.start();

    // Agregamos el círculo que representa el origen del viaje
    const originMarker = L.marker([origin.latitude, origin.longitude], {
      icon: L.icon({
        iconUrl: 'img/marker.png',
        iconSize: [20, 20],
      }),
    }).addTo(map);

    // Agregamos el círculo que representa el destino del viaje
    const destinationMarker = L.marker([destination.latitude, destination.longitude], {
      icon: L.icon({
        iconUrl: 'img/marker.png',
        iconSize: [20, 20],
      }),
    }).addTo(map);

    // Agregamos la ruta del viaje al mapa
    const route = await trip.getRoute();
    L.polyline(route, { color: '#000', weight: 5 }).addTo(map);

    // Agregamos un control deslizante para ajustar la velocidad
    const speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = 10;
    speedSlider.max = 100;
    speedSlider.value = 50;