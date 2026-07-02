import { useState } from "react";
import styles from "./StepDatos.module.css";

const FIELDS = [
  { key: "nombre", label: "Nombre completo", type: "text", placeholder: "Ej: Carlos Gómez", icon: "👤" },
  { key: "cedula", label: "Cédula", type: "text", placeholder: "Ej: 1020304050", icon: "🪪" },
  { key: "telefono", label: "Teléfono", type: "tel", placeholder: "Ej: 3001234567", icon: "📱" },
  { key: "correo", label: "Correo electrónico", type: "email", placeholder: "Ej: carlos@mail.com", icon: "✉️" },
  { key: "factura", label: "Número de factura", type: "text", placeholder: "Ej: FAC-2024-001", icon: "🧾" },
];

export default function StepDatos({ datos, onNext }) {
  const [form, setForm] = useState(datos);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    } else if (!/^\d{10}$/.test(f.cedula)) {
      e.cedula = "La cédula debe tener exactamente 10 dígitos";
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
    } else if (!/^FFE/i.test(f.factura)) {
      e.factura = "La factura debe comenzar con FFE";
    }
    return e;
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

  const handleBlur = (key) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = () => {
    setTouched({
      nombre: 1,
      cedula: 1,
      telefono: 1,
      factura: 1
    });
    const e = validate(form);
    setErrors(e);
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
              inputMode={key === "telefono" || key === "cedula" ? "numeric" : undefined}
              maxLength={key === "telefono" || key === "cedula" ? 10 : undefined}
              onChange={(e) => handleChange(key, e.target.value)}
              onBlur={() => handleBlur(key)}
              className={styles.input}
            />
            {errors[key] && <span className={styles.error}>{errors[key]}</span>}
          </div>
        ))}
      </div>

      <button className={styles.btn} onClick={handleSubmit}>
        Continuar a Pronósticos &nbsp;⚽
      </button>
    </div>
  );
}
