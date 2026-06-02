import { useState } from "react";
import styles from "./AdminModal.module.css";

export default function AdminModal({
  isOpen,
  onClose,
  onLogin
}) {

  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {

    onLogin(password);

    setPassword("");

  };

  return (

    <div className={styles.overlay}>

      <div className={styles.modal}>

        <h2 className={styles.title}>
          🔒 Acceso Administrador
        </h2>

        <input
          type="password"
          placeholder="Ingrese contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <div className={styles.buttons}>

          <button
            className={styles.btnCancel}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className={styles.btnLogin}
            onClick={handleSubmit}
          >
            Ingresar
          </button>

        </div>

      </div>

    </div>

  );

}