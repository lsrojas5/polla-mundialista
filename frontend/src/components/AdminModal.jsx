import { useState } from "react";
import styles from "./AdminModal.module.css";

export default function AdminModal({
  isOpen,
  onClose
}) {

  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);

  const ADMIN_PASSWORD = "AGSM2026";

  if (!isOpen) return null;

  const handleLogin = () => {

    if (password === ADMIN_PASSWORD) {

      setLogged(true);

    } else {

      alert("Contraseña incorrecta");

    }

  };

  const handleDownload = () => {

    window.open(
      "https://polla-mundialista-production-3177.up.railway.app/api/admin/export",
      "_blank"
    );

  };

  return (

    <div className={styles.overlay}>

      <div className={styles.modal}>

        {!logged ? (

          <>

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
                onClick={handleLogin}
              >
                Ingresar
              </button>

            </div>

          </>

        ) : (

          <>

            <h2 className={styles.title}>
              ✅ Acceso concedido
            </h2>

            <button
              className={styles.btnLogin}
              onClick={handleDownload}
            >
              📥 Descargar participantes.json
            </button>

            <br />

            <button
              className={styles.btnCancel}
              onClick={onClose}
            >
              Cerrar
            </button>

          </>

        )}

      </div>

    </div>

  );

}