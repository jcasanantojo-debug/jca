const form = document.getElementById('leadForm');
const message = document.getElementById('formMessage');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const nombre = formData.get('nombre')?.toString().trim();
  const telefono = formData.get('telefono')?.toString().trim();
  const hotel = formData.get('hotel')?.toString().trim();

  if (!nombre || !telefono || !hotel) {
    message.textContent = 'Por favor completa todos los campos.';
    return;
  }

  message.textContent = `¡Gracias ${nombre}! Te contactaremos pronto para impulsar las reservas de ${hotel}.`;
  form.reset();
});
