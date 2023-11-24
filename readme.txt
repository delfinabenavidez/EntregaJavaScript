Comenzando por el index, este utiliza las librerías Bootstrap y SweetAlert. En la sección del encabezado, se configura la codificación del documento y 
se enlazan las hojas de estilo de Bootstrap. En el cuerpo del documento, se emplean clases de Bootstrap para lograr un diseño responsivo.
Dentro del cuerpo, se incluyen formularios con opciones para seleccionar origen y destino, así como campos para ingresar el costo por
kilómetro y otros costos, cabe resaltar que los mismos estan en formato de dolar. Ya que mi idea en realidad era que en vez de poner el costo por
kilometro, queria automatizar este con una api, pero no encontré ninguna que diera valores por combustible en Argentina, por lo que decidi poner
un componente extra, que es la cotizacion del dolar del valor total.
La estructura del formulario es seguida por una sección destinada a "Otras consultas". Aquí se encuentra una tabla que proporciona 
información detallada sobre horarios, costos por kilómetro, otros costos, costo total y costo total en USD. 

En cuanto a los archivos de configuración, package-lock.json y package.json especifican las dependencias del proyecto. Bootstrap y SweetAlert2 
son las principales librerías utilizadas, con Bootstrap dependiendo a su vez de @popperjs/core. Estas dependencias son gestionadas a través
de npm.

En resumen, el proyecto entregado consiste en un Simulador de Viaje diseñado para proporcionar estimaciones de costos basados en la distancia
entre un origen y un destino, considerando costos adicionales. La interfaz utiliza las bibliotecas Bootstrap y SweetAlert2. El objetivo 
principal del mismo es permitir a los usuarios tener una estimación del costo total de un viaje, tomando en cuenta variables como la distancia
entre los puntos de origen y destino, el costo por kilómetro y otros gastos adicionales.