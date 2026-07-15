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
    nombre: { type: String, required: true, trim: true },
    cedula: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    correo: { type: String, trim: true, lowercase: true, default: "" },
    factura: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // Paso 2 – marcadores
    semifinal1: {
      equipo1: { type: String, required: true },
      goles1: { type: Number, required: true, min: 0 },
      equipo2: { type: String, required: true },
      goles2: { type: Number, required: true, min: 0 },
    },
    semifinal2: {
      equipo1: { type: String, required: true },
      goles1: { type: Number, required: true, min: 0 },
      equipo2: { type: String, required: true },
      goles2: { type: Number, required: true, min: 0 },
    },
    final: {
      equipo1: { type: String, required: true },
      goles1: { type: Number, required: true, min: 0 },
      equipo2: { type: String, required: true },
      goles2: { type: Number, required: true, min: 0 },
    },
  },
  { timestamps: true }
);

const Pronostico = mongoose.model("Pronostico", pronosticoSchema);

// ── Routes ──────────────────────────────────────────────────────────────────

app.get("/api/pronosticos/check/:factura", async (req, res) => {
  try {
    const factura = req.params.factura.trim().toUpperCase();
    const existeFactura = await Pronostico.findOne({ factura });

    res.json({
      success: true,
      exists: Boolean(existeFactura),
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// POST  /api/pronosticos  – guardar pronóstico completo
app.post("/api/pronosticos", async (req, res) => {

  try {

    // NORMALIZAR FACTURA
    const factura = req.body.factura.trim().toUpperCase();

    // VALIDAR SI YA EXISTE
    const existeFactura = await Pronostico.findOne({
      factura
    });

    if (existeFactura) {

      return res.status(400).json({
        success: false,
        error: "❌ Esta factura ya registró un pronóstico"
      });

    }

    // CREAR DOCUMENTO
    const doc = new Pronostico({
      ...req.body,
      factura
    });

    await doc.save();

    res.status(201).json({
      success: true,
      id: doc._id
    });

  } catch (err) {

    console.error(err);

    res.status(400).json({
      success: false,
      error: err.message
    });

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
// EXPORTAR PARTICIPANTES JSON

app.get("/api/admin/export", async (req, res) => {

  try {

    const participantes = await Pronostico
      .find()
      .sort({ createdAt: -1 })
      .lean();

    res.download = undefined;

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=participantes.json"
    );

    res.setHeader(
      "Content-Type",
      "application/json; charset=utf-8"
    );

    return res.send(
      JSON.stringify(participantes, null, 2)
    );

  } catch (err) {

    console.error("Error exportando participantes:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }

});
// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
