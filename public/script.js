document.getElementById('inventoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
  
    const res = await fetch('/api/equipos', {
      method: 'POST',
      body: formData
    });
  
    if (res.ok) {
      alert("Equipo registrado correctamente");
      form.reset();
    } else {
      alert("Error al registrar el equipo");
    }
  });
  