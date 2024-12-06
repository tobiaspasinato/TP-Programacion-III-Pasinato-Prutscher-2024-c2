class Ticket {
    constructor() {
        this.fechaActual = new Date().toLocaleDateString();
        this.metodosPago = ['MercadoPago', 'Efectivo', 'Tarjeta'];
        this.metodoPagoAleatorio = this.metodosPago[Math.floor(Math.random() * this.metodosPago.length)];
        this.carrito = JSON.parse(localStorage.getItem('carrito'));
    }

    init() {
        this.setFecha();
        this.setNumeroOrden();
        this.setMetodoPago();
        this.setupEventListeners();
        this.renderCarrito();
    }

    setFecha() {
        document.querySelector('aside p:nth-child(2)').textContent = `Fecha: ${this.fechaActual}`;
    }

    setNumeroOrden() {
        document.querySelector('aside h1').textContent = `Numero de orden: #${this.numeroOrden}`;
    }

    setMetodoPago() {
        document.querySelector('aside p:nth-child(4)').textContent = `Metodo de pago: ${this.metodoPagoAleatorio}`;
    }

    setupEventListeners() {
        document.getElementById('back-button').addEventListener('click', () => {
            window.location.href = '../home.html';
        });

        document.getElementById('print-button').addEventListener('click', () => {
            this.printTicket();
        });
    }

    printTicket() {
        const ticket = document.querySelector('#ticket-container');

        html2canvas(ticket, {
            scale: 2,
            scrollX: 0,
            scrollY: -window.scrollY,
            useCORS: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            doc.save('ticket.pdf');
        });
    }

    async cargarProductos() {
        try {
            const response = await fetch(`http://localhost:3000/ventas/ultimoid`);
            const html = await response.text();
    
    
            if (html.trim() === '') {
                return false; 
            }
    
            document.getElementById('ticket-container').innerHTML = html;
            return true; 
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            return false; 
        }
    }

    renderCarrito() {
        if (this.carrito && this.carrito.length > 0) {
            const tablaBody = document.querySelector('#tabla tbody');
            let totalPrecio = 0;

            this.carrito.forEach(item => {
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

            document.getElementById('total-price').textContent = `Precio total: $${totalPrecio.toFixed(2)}`;
        } else {
            alert('El carrito está vacío');
            window.location.href = '../Home.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ticket = new Ticket();
    ticket.init();
});