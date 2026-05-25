import { useState } from "react";
import styles from "./StepMarcadores.module.css";

// Lista de selecciones del Mundial 2026
const EQUIPOS = [
  "Argentina","Brasil","Francia","España","Alemania","Inglaterra","Portugal",
  "Países Bajos","Bélgica","Italia","Uruguay","Colombia","México","Estados Unidos",
  "Canadá","Marruecos","Senegal","Japón","Corea del Sur","Australia","Croacia",
  "Suiza","Polonia","Ecuador","Qatar","Arabia Saudita","Ghana","Camerún",
  "Túnez","Serbia","Dinamarca","Gales",
];

function MatchCard({ label, partido, onChange, emoji }) {
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
            {EQUIPOS.map((eq) => <option key={eq}>{eq}</option>)}
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
            {EQUIPOS.map((eq) => <option key={eq}>{eq}</option>)}
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
        <h2 className={styles.cardTitle}>Tus Pronósticos</h2>
        <p className={styles.cardSub}>Selecciona equipos y predice el marcador</p>
      </div>

      <div className={styles.matches}>
        <p className={styles.sectionTitle}>⚔️ Semifinales</p>
        <MatchCard
          label="Semifinal 1"
          emoji="🥈"
          partido={form.semifinal1}
          onChange={(k, v) => update("semifinal1", k, v)}
        />
        <MatchCard
          label="Semifinal 2"
          emoji="🥈"
          partido={form.semifinal2}
          onChange={(k, v) => update("semifinal2", k, v)}
        />

        <p className={styles.sectionTitle} style={{ marginTop: "1.5rem" }}>🏆 Gran Final</p>
        <MatchCard
          label="FINAL"
          emoji="🏆"
          partido={form.final}
          onChange={(k, v) => update("final", k, v)}
        />
      </div>

      <div className={styles.buttons}>
        <button className={styles.btnBack} onClick={onBack}>← Volver</button>
        <button className={styles.btnSubmit} onClick={handleSubmit} disabled={loading}>
          {loading ? "Enviando..." : "Enviar Pronóstico 🚀"}
        </button>
      </div>
    </div>
  );
}
