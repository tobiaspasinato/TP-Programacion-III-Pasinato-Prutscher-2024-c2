document.addEventListener('DOMContentLoaded', () => {
    // Obtiene la fecha actual del sistema
    const fechaActual = new Date().toLocaleDateString(); // Formato de fecha local (ej. 01/12/2024)
    document.querySelector('aside p:nth-child(2)').textContent = `Fecha: ${fechaActual}`;

    // Genera un número de orden aleatorio
    const numeroOrden = Math.floor(Math.random() * 10000) + 1; // Número entre 1 y 10000
    document.querySelector('aside h1').textContent = `Numero de orden: #${numeroOrden}`;

    // Cambia el método de pago de forma aleatoria
    const metodosPago = ['MercadoPago', 'Efectivo', 'Tarjeta'];
    const metodoPagoAleatorio = metodosPago[Math.floor(Math.random() * metodosPago.length)];
    document.querySelector('aside p:nth-child(4)').textContent = `Metodo de pago: ${metodoPagoAleatorio}`;

    // Regresa a la página principal
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = '../../';
    });

    // Imprime el ticket como PDF
    document.getElementById('print-button').addEventListener('click', function() {
        const ticket = document.querySelector('#ticket-container');

        html2canvas(ticket, {
            scale: 2, // Aumenta la calidad
            scrollX: 0, // Evita que el desplazamiento horizontal afecte la captura
            scrollY: -window.scrollY, // Evita el desplazamiento vertical en la captura
            useCORS: true // Evita problemas de recursos externos (CSS o imágenes)
        }).then(function(canvas) {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF('p', 'mm', 'a4');

            // Mantiene la relación de aspecto del ticket para no cortar el contenido
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Agrega la imagen en páginas sucesivas
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Descarga el archivo PDF
            doc.save('ticket.pdf');
        });
    });

    const carrito = JSON.parse(localStorage.getItem('carrito'));

    if (carrito && carrito.length > 0) {
        const tablaBody = document.querySelector('#tabla tbody');
        let totalPrecio = 0;

        carrito.forEach(item => {
            const total = item.price * item.quantity;
            totalPrecio += total;

            const fila = `
                <tr>
                    <td class="product">
                        <p>${item.name}</p>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>$${total.toFixed(2)}</td>
                </tr>
            `;
            tablaBody.innerHTML += fila;
        });

        // Actualiza el precio total
        document.getElementById('total-price').textContent = `Precio total: $${totalPrecio.toFixed(2)}`;
    } else {
        alert('El carrito está vacío');
        window.location.href = '../Home.html'; // Redirige si no hay productos
    }
});