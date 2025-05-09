window.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/api/equipos');
    const equipos = await res.json();
    const tbody = document.querySelector('#tablaInventario tbody');
  
    equipos.forEach((eq, index) => {
      const tr = document.createElement('tr');
  
      tr.innerHTML = `
        <td>${eq.numeroSerie || ''}</td>
        <td>${eq.sistemaOperativo || ''}</td>
        <td>${eq.procesador || ''}</td>
        <td>${eq.ram || ''}</td>
        <td>${eq.adaptadoresRed || ''}</td>
        <td>${eq.foto ? `<img src="${eq.foto}" alt="foto" width="80">` : 'Sin imagen'}</td>
        <td>
          <button onclick="editar(${index})">Editar</button>
          <button onclick="eliminar(${index})">Eliminar</button>
        </td>
      `;
  
      tbody.appendChild(tr);
    });
  });
  
  async function eliminar(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      const res = await fetch(`/api/equipos/${index}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        location.reload();
      } else {
        alert('Error al eliminar');
      }
    }
  }
  
  function editar(index) {
    alert('Función de edición aún no implementada');
  }
  