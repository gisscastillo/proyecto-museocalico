import { useEffect } from "react";
import "../styles.css";

function Museo() {
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }, []);

useEffect(() => {
  const fraseEl = document.getElementById("frase-texto");
  const climaEl = document.getElementById("clima-texto");

  if (fraseEl)
    fraseEl.textContent = '"El arte es la expresión del alma."';

  if (climaEl)
    climaEl.textContent =
      "22°C — Disfruta de nuestras salas climatizadas.";
}, []);

  // cerrar sesión
  const cerrarSesion = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const form = document.getElementById("reservationForm");
    if (!form) return;

    const handler = async (e) => {
      e.preventDefault();

      const reservaPayload = {
        nombre: document.getElementById("nombre_completo").value,
        email: document.getElementById("correo_electronico").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
        personas: parseInt(
          document.getElementById("cantidad_personas").value
        ),
      };

      try {
        const res = await fetch("https://proyecto-museocalico2.onrender.com/api/reservas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(reservaPayload),
        });

        const data = await res.json();

        if (res.ok) {
          alert("¡Reserva exitosa!");
          form.reset();
        } else {
          alert("Error: " + data.mensaje);
        }
      } catch (err) {
        alert("No se pudo conectar con el servidor.");
      }
    };

    form.addEventListener("submit", handler);
    return () => form.removeEventListener("submit", handler);
  }, []);

  return (
    <>
      {/*header */}
      <header
        className="hero"
        style={{ height: "40vh", minHeight: "300px" }}
      >
        <nav className="navbar">
          <div className="logo">MUSEO CÁLICO</div>
          <ul className="nav-links">
            <li>
              <a href="#" onClick={cerrarSesion}>
                Cerrar Sesión
              </a>
            </li>
          </ul>
        </nav>

        <div className="hero-content">
          <h1>GALERÍA</h1>
          <p>Bienvenido a tu espacio de apreciación artística</p>
        </div>
      </header>

      <main className="parchment-bg">
        {/* mision y vision*/}
        <section className="about container">
          <div className="gallery-plate">
            <div className="plate-content">
              <h2>Nuestra Misión</h2>
              <p>
                Promover el acceso al arte a través de programas educativos y
                actividades que fomenten la apreciación artística en la
                comunidad global.
              </p>
            </div>
          </div>

          <div className="gallery-plate">
            <div className="plate-content">
              <h2>Nuestra Visión</h2>
              <p>
                Ser un referente cultural que inspire a nuevas generaciones y
                fortalezca el valor del arte como motor de identidad social.
              </p>
            </div>
          </div>
        </section>

        {/* frase y clima*/}
        <section className="container" style={{ marginTop: "40px" }}>
          <div
            className="gallery-plate"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              border: "1px solid #d4af37",
            }}
          >
            <div className="plate-content" style={{ textAlign: "center" }}>
              <h2 id="frase-texto">"Cargando inspiración..."</h2>

              <div
                style={{
                  marginTop: "15px",
                  borderTop: "1px solid #eee",
                  paddingTop: "10px",
                }}
              >
                <p>
                  <i className="fa-solid fa-cloud-sun"></i>{" "}
                  <span id="clima-texto">Consultando clima...</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* galería */}
        <section id="proyectos" className="container">
          <h2 className="section-title">EXPERIENCIAS DESTACADAS</h2>

          <div className="gallery-grid">

            <article className="art-card">
              <div className="frame">
                <img
                  src="https://i.pinimg.com/736x/f2/50/28/f250284e97797a2710edc9252a377a9a.jpg"
                  alt="Pintura clásica"
                />
                <div className="overlay">
                  <p>Colección de maestros del Renacimiento.</p>
                </div>
              </div>
              <h3>Pintura Clásica</h3>
            </article>

            <article className="art-card">
              <div className="frame">
                <img
                  src="https://i.pinimg.com/1200x/d6/05/8a/d6058aaf18506c8f40b41395c054c9b8.jpg"
                  alt="Escultura"
                />
                <div className="overlay">
                  <p>Exploración de formas contemporáneas.</p>
                </div>
              </div>
              <h3>Escultura</h3>
            </article>

            <article className="art-card">
              <div className="frame">
                <img
                  src="https://i.pinimg.com/1200x/20/15/fd/2015fd55c15659df7fa0ff39c8f913cc.jpg"
                  alt="Talleres"
                />
                <div className="overlay">
                  <p>Cursos prácticos de óleo y acuarela.</p>
                </div>
              </div>
              <h3>Talleres de Arte</h3>
            </article>

            <article className="art-card">
              <div className="frame">
                <img
                  src="https://i.pinimg.com/736x/2f/87/76/2f87769a6a415c8cf11e44f86d6723b7.jpg"
                  alt="Joyería"
                />
                <div className="overlay">
                  <p>Piezas históricas de orfebrería.</p>
                </div>
              </div>
              <h3>Historia de la Joyería</h3>
            </article>

            <article className="art-card">
              <div className="frame">
                <img
                  src="https://i.pinimg.com/1200x/0b/bd/e1/0bbde19177188dfe7d82044b73cc22a1.jpg"
                  alt="Arquitectura"
                />
                <div className="overlay">
                  <p>Recorrido por el diseño del edificio.</p>
                </div>
              </div>
              <h3>Arquitectura</h3>
            </article>

            <article className="art-card">
              <div className="frame">
                <img
                  src="https://i.pinimg.com/736x/8b/3c/a5/8b3ca5551223e17410e962e3ab811823.jpg"
                  alt="Galería internacional"
                />
                <div className="overlay">
                  <p>Obras de artistas de todo el mundo.</p>
                </div>
              </div>
              <h3>Galería Global</h3>
            </article>
          </div>
        </section>

        {/* horarios y reservas*/}
        <section
          id="contacto"
          className="container booking-combined"
          style={{ marginTop: "80px", paddingBottom: "80px" }}
        >
          {/* horarios */}
          <div className="gallery-plate schedule-card">
            <div className="plate-content">
              <i className="fa-regular fa-clock schedule-icon"></i>
              <h2>Horarios de Galería</h2>

              <div className="schedule-grid">
                <div className="day-row">
                  <span>Lunes a Viernes</span>
                  <span className="dots"></span>
                  <span>09:00 - 19:00</span>
                </div>

                <div className="day-row">
                  <span>Sábados</span>
                  <span className="dots"></span>
                  <span>10:00 - 20:00</span>
                </div>

                <div className="day-row highlight">
                  <span>Domingos</span>
                  <span className="dots"></span>
                  <span>11:00 - 16:00</span>
                </div>
              </div>

              <p className="schedule-note">
                * Durante los días festivos el museo permanece cerrado.
              </p>

              <div className="address-box">
                <i className="fa-solid fa-location-dot"></i>
                <p>
                  Calle de las Artes #196, Distrito Cultural
                  <br />
                  Ciudad de México, CP 06090
                </p>
              </div>
            </div>
          </div>

          {/* formulario */}
          <div className="gold-frame form-wrapper">
            <div className="inner-content">
              <h2>Reservación de Boletos</h2>

              <form id="reservationForm" className="ticket-form">
                <div className="form-row">
                  <input
                    type="text"
                    id="nombre_completo"
                    placeholder="Nombre Completo"
                    required
                  />
                  <input
                    type="email"
                    id="correo_electronico"
                    placeholder="Correo"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>Fecha</label>
                    <input type="date" id="fecha" required />
                  </div>

                  <div className="input-group">
                    <label>Hora</label>
                    <input type="time" id="hora" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>Cantidad de Personas</label>
                    <input
                      type="number"
                      id="cantidad_personas"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-gold">
                  CONFIRMAR RESERVA
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          &copy; 2026 Museo Cálico de Pintura y Escultura. Todos los derechos
          reservados.
        </p>
      </footer>
    </>
  );
}

export default Museo;