import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { AUTH_ENDPOINTS } from "../config/api";

function Login() {
  const navigate = useNavigate(); 

  const [isLogin, setIsLogin] = useState(true);

  const showForm = (type) => {
    setIsLogin(type === "login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.loginEmail.value;
    const password = e.target.loginPass.value;

    try {
      const res = await fetch("https://proyecto-museocalico2.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // guardar sesión
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.rol);

        // navegación React correcta
        navigate(data.rol === "admin" ? "/admin" : "/");
      } else {
        alert(data.mensaje);
      }
    } catch (err) {
      alert("Error de conexión con el servidor.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://proyecto-museocalico2.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: e.target.regNombre.value,
          email: e.target.regEmail.value,
          password: e.target.regPass.value,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("¡Registro exitoso! Ahora inicia sesión.");
        setIsLogin(true);
      } else {
        alert(data.mensaje);
      }
    } catch (err) {
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="toggle-btns">
          <button
            className={`toggle-btn ${isLogin ? "active" : ""}`}
            onClick={() => showForm("login")}
          >
            INICIAR SESIÓN
          </button>

          <button
            className={`toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={() => showForm("register")}
          >
            REGISTRARSE
          </button>
        </div>

        {/* LOGIN */}
        {isLogin && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="loginEmail"
              placeholder="Correo Electrónico"
              required
            />
            <input
              type="password"
              name="loginPass"
              placeholder="Contraseña"
              required
            />
            <button type="submit" className="btn-gold">
              ENTRAR AL MUSEO
            </button>
          </form>
        )}

        {/* registro*/}
        {!isLogin && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="regNombre"
              placeholder="Nombre Completo"
              required
            />
            <input
              type="email"
              name="regEmail"
              placeholder="Correo Electrónico"
              required
            />
            <input
              type="password"
              name="regPass"
              placeholder="Contraseña"
              required
            />
            <button type="submit" className="btn-gold">
              CREAR CUENTA
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;