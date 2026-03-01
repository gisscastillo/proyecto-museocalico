import { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {
  const [reservas, setReservas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState("Cargando reservas...");

  const TOKEN = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const cargar = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reservas", {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje("No se pudieron obtener las reservas");
        return;
      }

      const datos = data.datos || [];

      setReservas(datos);
      setMensaje("");

      let suma = 0;
      datos.forEach((r) => {
        suma += parseInt(r.cantidad_personas || 0);
      });
      setTotal(suma);
    } catch (err) {
      console.error("Fallo al cargar:", err);
      setMensaje("No se pudo conectar con el servidor.");
    }
  };

  const borrar = async (id) => {
    if (!confirm("¿Deseas eliminar esta reserva permanentemente?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/reservas/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );

      if (res.ok) cargar();
      else alert("No se pudo eliminar la reserva.");
    } catch (err) {
      console.error("Error al borrar:", err);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const reservasFiltradas = reservas.filter((r) =>
    `${r.nombre_usuario} ${r.email_usuario}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <>
      <nav className="nav-admin">
        <div className="nav-logo">ADMIN CÁLICO</div>
        <div className="nav-buttons">
          <a href="/" className="btn-nav">
            <i className="fa-solid fa-eye"></i>
            <span>Ver Museo</span>
          </a>
          <button onClick={logout} className="btn-nav">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Salir</span>
          </button>
        </div>
      </nav>

      <div className="admin-page">
        <div className="admin-page-inner">

          <header className="header-admin">
            <h1>Gestión de Visitantes</h1>
          </header>

          <div className="stats-container">
            <div className="plate-info">
              <span>Boletos Registrados</span>
              <h2>{total}</h2>
            </div>
          </div>

          <div className="search-wrap">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Buscar visitante por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <main className="main-wrapper">
            <div className="table-dark-bg">
              <table>
                <thead>
                  <tr>
                    <th>Visitante</th>
                    <th>Correo</th>
                    <th>Fecha / Hora</th>
                    <th>Cant.</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {mensaje && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        {mensaje}
                      </td>
                    </tr>
                  )}

                  {!mensaje &&
                    reservasFiltradas.map((item) => {
                      const fechaLegible = new Date(item.fecha).toLocaleDateString(
                        "es-MX",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        }
                      );

                      return (
                        <tr key={item.id} className="row-museum">
                          <td>
                            <strong>{item.nombre_usuario}</strong>
                          </td>
                          <td>{item.email_usuario}</td>
                          <td>
                            {fechaLegible} | {item.hora}
                          </td>
                          <td>{item.cantidad_personas}</td>
                          <td>
                            <button
                              className="btn-del"
                              onClick={() => borrar(item.id)}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </main>

        </div> 
      </div>
    </>
  );
}

export default Admin;