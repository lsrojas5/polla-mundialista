import { useEffect, useRef, useState } from "react";
import styles from "./StepConfirmacion.module.css";

export default function StepConfirmacion({ data, onReset }) {
  const canvasRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!data) return;
    generateImage();
  }, [data]);

  const generateImage = () => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const W = 700, H = 420;
    canvas.width  = W;
    canvas.height = H;

    // ── Background gradient ──────────────────────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   "#071510");
    bg.addColorStop(0.5, "#0a3d22");
    bg.addColorStop(1,   "#061209");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth   = 1;
    for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Gold border
    ctx.strokeStyle = "#f5c518";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, W-20, H-20);
    ctx.strokeStyle = "rgba(245,197,24,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, W-32, H-32);

    // ── Trophy emoji as text ─────────────────────────────────────────────
    ctx.font = "64px serif";
    ctx.textAlign = "center";
    ctx.fillText("🏆", W/2, 88);

    // ── Title ────────────────────────────────────────────────────────────
    ctx.font = "bold 32px 'Bebas Neue', Arial";
    ctx.fillStyle = "#f5c518";
    ctx.textAlign = "center";
    ctx.letterSpacing = "4px";
    ctx.fillText("POLLA DEL MUNDIAL", W/2, 125);

    // ── Message ──────────────────────────────────────────────────────────
    ctx.font = "16px 'Rajdhani', Arial";
    ctx.fillStyle = "rgba(249,246,239,0.8)";
    ctx.fillText("¡Te deseamos que este marcador coseche muchos éxitos!", W/2, 150);

    // ── Name ─────────────────────────────────────────────────────────────
    ctx.font = "bold 22px 'Rajdhani', Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(data.nombre.toUpperCase(), W/2, 180);

    // ── Divider ──────────────────────────────────────────────────────────
    const grad = ctx.createLinearGradient(60, 0, W-60, 0);
    grad.addColorStop(0,   "transparent");
    grad.addColorStop(0.5, "#f5c518");
    grad.addColorStop(1,   "transparent");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(60, 195); ctx.lineTo(W-60, 195); ctx.stroke();

    // ── Matches ──────────────────────────────────────────────────────────
    const drawMatch = (label, partido, y) => {
      // Box
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      roundRect(ctx, 30, y, W-60, 52, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(245,197,24,0.2)";
      ctx.lineWidth = 1;
      roundRect(ctx, 30, y, W-60, 52, 8);
      ctx.stroke();

      // Label
      ctx.font = "11px 'Rajdhani', Arial";
      ctx.fillStyle = "rgba(245,197,24,0.8)";
      ctx.textAlign = "left";
      ctx.fillText(label.toUpperCase(), 44, y+16);

      // Teams + score
      ctx.font = "bold 16px 'Rajdhani', Arial";
      ctx.fillStyle = "#f9f6ef";
      ctx.textAlign = "right";
      ctx.fillText(partido.equipo1, W/2 - 44, y+38);

      ctx.textAlign = "center";
      ctx.font = "bold 22px 'Bebas Neue', Arial";
      ctx.fillStyle = "#f5c518";
      ctx.fillText(`${partido.goles1}  -  ${partido.goles2}`, W/2, y+40);

      ctx.textAlign = "left";
      ctx.font = "bold 16px 'Rajdhani', Arial";
      ctx.fillStyle = "#f9f6ef";
      ctx.fillText(partido.equipo2, W/2 + 44, y+38);
    };

    drawMatch("⚽ Semifinal 1", data.semifinal1, 205);
    drawMatch("⚽ Semifinal 2", data.semifinal2, 265);
    drawMatch("🏆 Gran Final",  data.final,      325);

    // ── Footer ───────────────────────────────────────────────────────────
    ctx.font = "12px 'Rajdhani', Arial";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.textAlign = "center";
    ctx.fillText(`Factura: ${data.factura}  •  Cédula: ${data.cedula}  •  ${data.correo}`, W/2, H-20);

    setImgUrl(canvas.toDataURL("image/png"));
  };

  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href     = imgUrl;
    a.download = `pronostico-${data.nombre.replace(/\s+/g,"-")}.png`;
    a.click();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.confetti}>🎉🏆⚽🌟🎊</div>
        <h2 className={styles.title}>¡Pronóstico Registrado!</h2>
        <p className={styles.msg}>
          <strong>{data?.nombre}</strong>, tu pronóstico fue guardado con éxito.<br />
          ¡Te deseamos que este marcador coseche muchos éxitos!
        </p>

        {/* Hidden canvas */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Generated image */}
        {imgUrl && (
          <div className={styles.imgWrap}>
            <img src={imgUrl} alt="Tu pronóstico" className={styles.img} />
          </div>
        )}

        <div className={styles.buttons}>
          {imgUrl && (
            <button className={styles.btnDownload} onClick={handleDownload}>
              ⬇️ Descargar imagen
            </button>
          )}
          <button className={styles.btnReset} onClick={onReset}>
            + Nuevo pronóstico
          </button>
        </div>
      </div>
    </div>
  );
}
