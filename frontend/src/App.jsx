import { useState } from "react";

import StepDatos from "./pages/StepDatos.jsx";
import StepMarcadores from "./pages/StepMarcadores.jsx";
import StepConfirmacion from "./pages/StepConfirmacion.jsx";

import Header from "./components/Header.jsx";

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

  // API URL Railway
  const API_URL = import.meta.env.VITE_API_URL;

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

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* HEADER */}
      <Header step={step} />

      {/* CONTENIDO */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
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

    </div>

  );

}