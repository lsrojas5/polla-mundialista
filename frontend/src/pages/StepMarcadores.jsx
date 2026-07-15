import { useState } from "react";
import styles from "./StepMarcadores.module.css";

// Lista de selecciones del Mundial 2026
const EQUIPOS = [
  "Inglaterra",
  "España",
  "Argentina",
];

function MatchCard({ label, partido, onChange, emoji, options = EQUIPOS }) {
  return (
    <div className={styles.matchCard}>
      <div className={styles.matchLabel}>
        <span className={styles.matchEmoji}>{emoji}</span>
        {label}
      </div>
      <div className={styles.matchRow}>
        {/* Equipo 1 */}
        <div className={styles.team}>
          <select
            value={partido.equipo1}
            onChange={(e) => onChange("equipo1", e.target.value)}
            className={styles.select}
          >
            {options.map((eq) => <option key={eq}>{eq}</option>)}
          </select>
        </div>

        {/* Marcador */}
        <div className={styles.score}>
          <button className={styles.scoreBtn} onClick={() => onChange("goles1", Math.max(0, partido.goles1 - 1))}>−</button>
          <span className={styles.scoreNum}>{partido.goles1}</span>
          <button className={styles.scoreBtn} onClick={() => onChange("goles1", partido.goles1 + 1)}>+</button>

          <span className={styles.vs}>VS</span>

          <button className={styles.scoreBtn} onClick={() => onChange("goles2", Math.max(0, partido.goles2 - 1))}>−</button>
          <span className={styles.scoreNum}>{partido.goles2}</span>
          <button className={styles.scoreBtn} onClick={() => onChange("goles2", partido.goles2 + 1)}>+</button>
        </div>

        {/* Equipo 2 */}
        <div className={styles.team}>
          <select
            value={partido.equipo2}
            onChange={(e) => onChange("equipo2", e.target.value)}
            className={`${styles.select} ${styles.selectRight}`}
          >
            {options.map((eq) => <option key={eq}>{eq}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function StepMarcadores({ marcadores, onBack, onSubmit }) {
  const [form, setForm] = useState(marcadores);
  const [loading, setLoading] = useState(false);

  const update = (partido, key, val) =>
    setForm((f) => ({ ...f, [partido]: { ...f[partido], [key]: val } }));

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.stepBadge}>PASO 2</span>
        <h2 className={styles.cardTitle}>Pronóstico ganador</h2>
        <p className={styles.cardSub}>Selecciona equipos y predice el marcador</p>
      </div>

      <div className={styles.matches}>
        <div className={styles.heroSection}>
          <p className={styles.sectionTitle}>🏆 Gran Final</p>
          <p className={styles.sectionHint}>Elige los dos equipos finalistas y predice el marcador.</p>
        </div>

        <MatchCard
          label="FINAL"
          emoji="🏆"
          partido={form.final}
          onChange={(k, v) => update("final", k, v)}
          options={EQUIPOS}
        />
      </div>

      <div className={styles.buttons}>
        <button className={styles.btnBack} onClick={onBack}>← Volver</button>
        <button className={styles.btnSubmit} onClick={handleSubmit} disabled={loading}>
          {loading ? "Enviando..." : "Buena suerte!!! 🚀"}
        </button>
      </div>
    </div>
  );
}
