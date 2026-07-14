import styles from "./Header.module.css";
import banner from "../assets/banner-polla.jpg";

const STEPS = ["Tus Datos", "Pronósticos", "¡Listo!"];

export default function Header({ step, onAdminClick }) {

  return (

    <header className={styles.header}>

      {/* BARRA SUPERIOR */}
      <div className={styles.topBar}>

        <button
          className={styles.adminButton}
          onClick={onAdminClick}
          title="Administrador"
        >
          ☰
        </button>

      </div>

      {/* HEADER PRINCIPAL */}
      <div className={styles.banner}>

        <img
          src={banner}
          alt="Polla Mundialista"
          className={styles.bannerImage}
        />

      </div>

      {/* PROGRESS BAR */}
      <nav className={styles.steps}>

        {STEPS.map((label, i) => {

          const num = i + 1;
          const active = step === num;
          const done = step > num;

          return (

            <div
              key={num}
              className={`${styles.step}
                ${active ? styles.active : ""}
                ${done ? styles.done : ""}`}
            >

              <div className={styles.circle}>
                {done ? "✓" : num}
              </div>

              <span className={styles.label}>
                {label}
              </span>

              {i < STEPS.length - 1 && (
                <div className={styles.line} />
              )}

            </div>

          );

        })}

      </nav>

    </header>

  );

}