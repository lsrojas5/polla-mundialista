import { useState } from "react";

import StepDatos from "./pages/StepDatos.jsx";
import StepMarcadores from "./pages/StepMarcadores.jsx";
import StepConfirmacion from "./pages/StepConfirmacion.jsx";

import Header from "./components/Header.jsx";
import AdminModal from "./components/AdminModal.jsx";

const initialDatos = {
  nombre: "",
  cedula: "",
  telefono: "",
  correo: "",
  factura: "",
};

const initialMarcadores = {
  semifinal1: {
    equipo1: "Brasil",
    goles1: 0,
    equipo2: "Argentina",
    goles2: 0,
  },

  semifinal2: {
    equipo1: "Francia",
    goles1: 0,
    equipo2: "España",
    goles2: 0,
  },

  final: {
    equipo1: "Brasil",
    goles1: 0,
    equipo2: "Francia",
    goles2: 0,
  },
};

export default function App() {

  const [step, setStep] = useState(1);

  const [datos, setDatos] = useState(initialDatos);

  const [marcadores, setMarcadores] =
    useState(initialMarcadores);

  const [submitData, setSubmitData] =
    useState(null);
  const [showAdmin, setShowAdmin] =
    useState(false);

  const [adminLogged, setAdminLogged] =
    useState(false);
  // API URL Railway
  const API_URL = import.meta.env.VITE_API_URL || "";

  // Paso 1 → Paso 2
  const handleDatosNext = (d) => {

    setDatos(d);

    setStep(2);

  };

  // Enviar pronóstico
  const handleMarcadoresSubmit = async (m) => {

    setMarcadores(m);

    const payload = {
      ...datos,
      ...m,
    };

    try {

      const res = await fetch(
        `${API_URL}/api/pronosticos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error(
          `Error ${res.status}: ${res.statusText}`
        );
      }

      const json = await res.json();

      // Validar errores backend
      if (!json.success) {

        throw new Error(json.error);

      }

      // Guardar datos enviados
      setSubmitData({
        ...payload,
        id: json.id,
      });

      // Ir a confirmación
      setStep(3);

    } catch (err) {

      console.error(err);

      alert(
        "Error al guardar: " + err.message
      );

    }

  };

  // Reiniciar formulario
  const handleReset = () => {

    setDatos(initialDatos);

    setMarcadores(initialMarcadores);

    setSubmitData(null);

    setStep(1);

  };
  // Login administrador
  const handleAdminLogin = (password) => {

    if (password === "AGSM2026") {

      setAdminLogged(true);

      setShowAdmin(false);

      alert("Acceso concedido");

    } else {

      alert("Contraseña incorrecta");

    }

  };
  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* HEADER */}
      <Header
        step={step}
        onAdminClick={() => setShowAdmin(true)}
      />

      {/* CONTENIDO */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem 4.5rem",
        }}
      >

        {step === 1 && (
          <StepDatos
            datos={datos}
            onNext={handleDatosNext}
          />
        )}

        {step === 2 && (
          <StepMarcadores
            marcadores={marcadores}
            onBack={() => setStep(1)}
            onSubmit={handleMarcadoresSubmit}
          />
        )}

        {step === 3 && (
          <StepConfirmacion
            data={submitData}
            onReset={handleReset}
          />
        )}

      </main>

      <footer
        aria-hidden="true"
        style={{
          padding: "0.5rem 1rem 1rem",
          textAlign: "center",
          pointerEvents: "none",
          fontFamily: "var(--font-display)",
          fontSize: "0.9rem",
          letterSpacing: "0.18rem",
          color: "rgba(245, 197, 24, 0.16)",
          textShadow: "0 0 10px rgba(245, 197, 24, 0.08)",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        🌱 Agroinsumos San Miguel SAS 🌱
      </footer>

      <AdminModal
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        onLogin={handleAdminLogin}
      />

    </div>

  );

}