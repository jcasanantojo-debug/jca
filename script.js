const leadForm = document.getElementById('leadForm');
const leadMessage = document.getElementById('formMessage');

leadForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const nombre = formData.get('nombre')?.toString().trim();
  const telefono = formData.get('telefono')?.toString().trim();
  const hotel = formData.get('hotel')?.toString().trim();

  if (!nombre || !telefono || !hotel) {
    leadMessage.textContent = 'Por favor completa todos los campos.';
    return;
  }

  leadMessage.textContent = `¡Gracias ${nombre}! Te contactaremos pronto para impulsar las reservas de ${hotel}.`;
  leadForm.reset();
});

const chatMessages = document.getElementById('chatMessages');
const chatbotForm = document.getElementById('chatbotForm');
const chatInput = document.getElementById('chatInput');
const restartButton = document.getElementById('restartChat');

const state = {
  step: 'greeting',
  data: {
    fechas: '',
    personas: '',
    nombre: '',
    email: '',
    telefono: ''
  }
};

function appendMessage(text, author = 'bot') {
  const message = document.createElement('div');
  message.className = `message ${author}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function startConversation() {
  chatMessages.innerHTML = '';
  state.step = 'ask_dates';
  state.data = { fechas: '', personas: '', nombre: '', email: '', telefono: '' };

  appendMessage('¡Hola! 👋 Bienvenido a HotelFlow. Te ayudaré a cotizar tu reserva en menos de 1 minuto.');
  appendMessage('¿Qué fechas deseas reservar? (Ej: 20/05 al 23/05)');
  chatInput.placeholder = 'Ej: 20/05 al 23/05';
  chatInput.focus();
}

function handleBotFlow(userText) {
  switch (state.step) {
    case 'ask_dates':
      state.data.fechas = userText;
      state.step = 'ask_guests';
      appendMessage('Perfecto. ¿Para cuántas personas sería la reserva?');
      chatInput.placeholder = 'Ej: 2 adultos y 1 niño';
      break;

    case 'ask_guests':
      state.data.personas = userText;
      state.step = 'show_availability';
      appendMessage(
        `Tengo disponibilidad simulada para ${state.data.personas} en las fechas ${state.data.fechas}:\nSuite Deluxe - 189€/noche con desayuno incluido.`
      );
      appendMessage('¿A nombre de quién registramos la pre-reserva?');
      chatInput.placeholder = 'Tu nombre completo';
      state.step = 'ask_name';
      break;

    case 'ask_name':
      state.data.nombre = userText;
      state.step = 'ask_email';
      appendMessage('¡Gracias! ¿Cuál es tu email para enviarte la propuesta?');
      chatInput.placeholder = 'correo@ejemplo.com';
      break;

    case 'ask_email':
      state.data.email = userText;
      state.step = 'ask_phone';
      appendMessage('Último paso: comparte tu teléfono para confirmar por WhatsApp o llamada.');
      chatInput.placeholder = '+34 600 000 000';
      break;

    case 'ask_phone':
      state.data.telefono = userText;
      state.step = 'done';
      appendMessage(
        `¡Listo, ${state.data.nombre}! ✅ Capturamos tus datos. En breve un asesor te contactará al ${state.data.telefono} para finalizar la reserva.`
      );
      appendMessage('Si quieres reiniciar el flujo, pulsa "Reiniciar flujo".');
      chatInput.placeholder = 'Flujo finalizado';
      break;

    default:
      appendMessage('El flujo ya terminó. Pulsa "Reiniciar flujo" para comenzar de nuevo.');
      break;
  }
}

chatbotForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();

  if (!value) {
    return;
  }

  appendMessage(value, 'user');
  chatInput.value = '';
  handleBotFlow(value);
});

restartButton.addEventListener('click', startConversation);

startConversation();
