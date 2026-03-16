// kiosco.js - Cliente del Kiosk de Turnos

const socket = io();

// Áreas disponibles
const areas = {
    'Facturación': 'F',
    'Consulta': 'C',
    'Laboratorio': 'L',
    'Farmacia': 'P',
    'Emergencias': 'E'
};

let currentTurn = null;

// Generar número de turno
function generateTurnNumber(areaPrefix) {
    const number = Math.floor(Math.random() * 100) + 1;
    return areaPrefix + String(number).padStart(2, '0');
}

// Función para obtener turno
function getTurn(areaName) {
    const prefix = areas[areaName];
    currentTurn = generateTurnNumber(prefix);
    
    const turnData = {
        turn: currentTurn,
        area: areaName,
        timestamp: new Date().toLocaleString(),
        prefix: prefix
    };

    // Emitir evento al servidor
    socket.emit('new_turn', turnData);
    
    // Mostrar ticket
    showTicket(turnData);
}

// Mostrar ticket en pantalla
function showTicket(data) {
    const ticketHTML = `
        <div class="ticket-display">
            <div class="hospital-header">HOSPITAL SAN JUAN</div>
            <h2>TU TURNO</h2>
            <div class="turn-number">${data.turn}</div>
            <div class="turn-details">
                <p><strong>Área:</strong> ${data.area}</p>
                <p><strong>Fecha:</strong> ${data.timestamp}</p>
            </div>
            <div class="ticket-footer">
                Espera tu llamada en la pantalla
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'ticket-modal';
    modal.innerHTML = ticketHTML;
    
    document.body.appendChild(modal);

    // Botón para imprimir
    setTimeout(() => {
        printTicket(data);
    }, 1000);
}

// Imprimir ticket
function printTicket(data) {
    const printWindow = window.open('', '', 'height=500,width=800');
    const content = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Ticket de Turno</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: #f5f5f5;
                    }
                    .ticket {
                        border: 3px dashed #333;
                        padding: 40px;
                        text-align: center;
                        background: white;
                        width: 400px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    .logo { font-size: 28px; font-weight: bold; margin-bottom: 20px; }
                    .turn { font-size: 72px; font-weight: bold; color: #007bff; margin: 30px 0; }
                    .area { font-size: 20px; margin: 10px 0; }
                    .time { font-size: 14px; color: #666; margin-top: 20px; }
                    .footer { font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="logo">🏥 HOSPITAL</div>
                    <h1>TURNO</h1>
                    <div class="turn">${data.turn}</div>
                    <div class="area"><strong>${data.area}</strong></div>
                    <div class="time">${data.timestamp}</div>
                    <div class="footer">Conserve este ticket para su referencia</div>
                </div>
            </body>
        </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Escuchar eventos del servidor
socket.on('connect', () => {
    console.log('Conectado al servidor');
});

socket.on('turn_called', (data) => {
    console.log('Turno llamado:', data);
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});
