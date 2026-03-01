import { useNavigate } from "react-router-dom";
import "../styles.css";

function Home() {
  const navigate = useNavigate();

  const entrarAlMuseo = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/museo");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="hero" style={{ height: "100vh" }}>
      <nav className="navbar">
        <div className="logo">MUSEO CÁLICO</div>
      </nav>

      <div className="hero-content">
        <h1>MUSEO CÁLICO</h1>
        <p>
          Un espacio dedicado a la preservación y contemplación del arte
        </p>

        <br />

        <button
          onClick={entrarAlMuseo}
          className="btn-gold"
          style={{
            padding: "15px 40px",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          EXPLORAR GALERÍA
        </button>
      </div>
    </header>
  );
}

export default Home;