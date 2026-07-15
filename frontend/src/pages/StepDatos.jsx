import { useState } from "react";
import styles from "./StepDatos.module.css";

const FIELDS = [
  { key: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej: Carlos Gómez", icon: "👤" },
  { key: "cedula", label: "Cédula", type: "text", placeholder: "Ej: 1020304050", icon: "🪪" },
  { key: "telefono", label: "Teléfono", type: "tel", placeholder: "Ej: 3001234567", icon: "📱" },
  { key: "correo", label: "Correo electrónico", type: "email", placeholder: "Ej: carlos@mail.com", icon: "✉️" },
  { key: "factura", label: "Número de factura", type: "text", placeholder: "Ej: FFE-001, TFE-2024, SFE-100", icon: "🧾" },
];

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:4000" : "");

export default function StepDatos({ datos, onNext }) {
  const [form, setForm] = useState(datos);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [checkingFactura, setCheckingFactura] = useState(false);

  const onlyDigits = (value) => value.replace(/\D/g, "");
  const onlyLetters = (value) => value.replace(/[0-9]/g, "");

  const validate = (f) => {
    const e = {};
    if (!f.nombre.trim()) {
      e.nombre = "El nombre es obligatorio";
    } else if (/\d/.test(f.nombre)) {
      e.nombre = "El nombre no debe contener números";
    }
    if (!f.cedula.trim()) {
      e.cedula = "La cédula es obligatoria";
    } else if (!/^\d{6,10}$/.test(f.cedula)) {
      e.cedula = "La cédula debe tener entre 6 y 10 dígitos";
    }
    if (!f.telefono.trim()) {
      e.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{10}$/.test(f.telefono)) {
      e.telefono = "El teléfono debe tener exactamente 10 dígitos";
    }
    if (
      f.correo.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo)
    ) {
      e.correo = "Correo no válido";
    }
    if (!f.factura.trim()) {
      e.factura = "El número de factura es obligatorio";
    } else if (!/^(FFE|RFE|TFE|ZFE|MFE|SFE)/i.test(f.factura)) {
      e.factura = "La factura debe comenzar con FFE, RFE, TFE, ZFE, MFE o SFE";
    }
    return e;
  };

  const verifyFactura = async (value) => {
    const factura = value.trim().toUpperCase();

    if (!factura || !/^(FFE|RFE|TFE|ZFE|MFE|SFE)/i.test(factura)) {
      return null;
    }

    try {
      setCheckingFactura(true);
      const res = await fetch(`${API_URL}/api/pronosticos/check/${encodeURIComponent(factura)}`);

      if (!res.ok) {
        throw new Error("No se pudo validar la factura");
      }

      const json = await res.json();
      return json.success && json.exists
        ? "Esta factura ya registró un pronóstico"
        : null;
    } catch (err) {
      console.error(err);
      return "No se pudo verificar la factura en este momento";
    } finally {
      setCheckingFactura(false);
    }
  };

  const handleChange = (key, val) => {
    const next = {
      ...form,
      [key]: key === "telefono" || key === "cedula"
        ? onlyDigits(val)
        : key === "nombre"
          ? onlyLetters(val)
          : val,
    };
    setForm(next);
    if (touched[key]) setErrors(validate(next));
  };

  const handleBlur = async (key) => {
    const nextTouched = { ...touched, [key]: true };
    setTouched(nextTouched);

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (key === "factura" && !nextErrors.factura) {
      const serverError = await verifyFactura(form.factura);
      if (serverError) {
        setErrors((prev) => ({ ...prev, factura: serverError }));
      } else {
        setErrors((prev) => {
          const current = { ...prev };
          delete current.factura;
          return current;
        });
      }
    }
  };

  const handleSubmit = async () => {
    setTouched({
      nombre: 1,
      cedula: 1,
      telefono: 1,
      factura: 1,
    });

    const e = validate(form);
    setErrors(e);

    if (e.factura) {
      return;
    }

    const serverError = await verifyFactura(form.factura);

    if (serverError) {
      setErrors((prev) => ({ ...prev, factura: serverError }));
      return;
    }

    if (Object.keys(e).length === 0) onNext(form);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.stepBadge}>PASO 1</span>
        <h2 className={styles.cardTitle}>Tus datos personales</h2>
        <p className={styles.cardSub}>Completa la información para registrar tu pronóstico</p>
      </div>

      <div className={styles.form}>
        {FIELDS.map(({ key, label, type, placeholder, icon }) => (
          <div key={key} className={`${styles.field} ${errors[key] ? styles.fieldError : touched[key] ? styles.fieldOk : ""}`}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>{icon}</span> {label}
            </label>
            <input
              type={type}
              value={form[key]}
              placeholder={placeholder}
              inputMode={key === "telefono" ? "numeric" : key === "cedula" ? "numeric" : undefined}
              maxLength={key === "telefono" ? 10 : key === "cedula" ? 10 : undefined}
              onChange={(e) => handleChange(key, e.target.value)}
              onBlur={() => handleBlur(key)}
              className={styles.input}
            />
            {errors[key] && <span className={styles.error}>{errors[key]}</span>}
          </div>
        ))}
      </div>

      <button className={styles.btn} onClick={handleSubmit} disabled={checkingFactura}>
        {checkingFactura ? "Validando factura..." : "Continuar a Pronósticos  ⚽"}
      </button>
    </div>
  );
}
