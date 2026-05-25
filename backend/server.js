require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ── MongoDB Connection ──────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mundial_polla";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected:", MONGO_URI))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── Schema ──────────────────────────────────────────────────────────────────
const pronosticoSchema = new mongoose.Schema(
  {
    // Paso 1 – datos personales
    nombre:    { type: String, required: true, trim: true },
    cedula:    { type: String, required: true, trim: true },
    telefono:  { type: String, required: true, trim: true },
    correo:    { type: String, required: true, trim: true, lowercase: true },
    factura:   { type: String, required: true, trim: true },

    // Paso 2 – marcadores
    semifinal1: {
      equipo1: { type: String, required: true },
      goles1:  { type: Number, required: true, min: 0 },
      equipo2: { type: String, required: true },
      goles2:  { type: Number, required: true, min: 0 },
    },
    semifinal2: {
      equipo1: { type: String, required: true },
      goles1:  { type: Number, required: true, min: 0 },
      equipo2: { type: String, required: true },
      goles2:  { type: Number, required: true, min: 0 },
    },
    final: {
      equipo1: { type: String, required: true },
      goles1:  { type: Number, required: true, min: 0 },
      equipo2: { type: String, required: true },
      goles2:  { type: Number, required: true, min: 0 },
    },
  },
  { timestamps: true }
);

const Pronostico = mongoose.model("Pronostico", pronosticoSchema);

// ── Routes ──────────────────────────────────────────────────────────────────

// POST  /api/pronosticos  – guardar pronóstico completo
app.post("/api/pronosticos", async (req, res) => {
  try {
    const doc = new Pronostico(req.body);
    await doc.save();
    res.status(201).json({ success: true, id: doc._id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET  /api/pronosticos  – listar todos (útil para admin)
app.get("/api/pronosticos", async (req, res) => {
  try {
    const docs = await Pronostico.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
