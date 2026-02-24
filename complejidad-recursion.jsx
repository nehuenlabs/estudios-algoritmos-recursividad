import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const colors = {
  logn: "#00f5d4",
  n: "#fee440",
  n2: "#f15bb5",
  twon: "#ff4d6d",
  fourN: "#ff9500",
};

const recursionTypes = [
  {
    id: "lineal",
    name: "Recursión Lineal Simple",
    example: "Collatz",
    bigO: "O(n)",
    bigOmega: "Ω(log n)",
    bigTheta: "Θ(n)",
    littleO: "o(n²)",
    color: colors.n,
    curveKey: "n",
    description:
      "Genera exactamente una llamada recursiva por paso. El problema se reduce en 1 (o una constante) por llamada.",
    formula: "T(n) = T(n-1) + O(1) → T(n) = O(n)",
    space: "O(n) — un frame por cada llamada en el call stack",
    examples: [
      { n: 5, ops: 5, calc: "factorial(5) → 5 llamadas: n=5,4,3,2,1,0" },
      { n: 10, ops: 10, calc: "factorial(10) → 10 llamadas: n=10,9,...,1,0" },
      { n: 100, ops: 100, calc: "factorial(100) → 100 llamadas al stack" },
    ],
  },
  {
    id: "paridad",
    name: "Recursión por Paridad",
    example: "Stern",
    bigO: "O(log n)",
    bigOmega: "Ω(log n)",
    bigTheta: "Θ(log n)",
    littleO: "o(n)",
    color: colors.logn,
    curveKey: "logn",
    description:
      "Divide el argumento a la mitad en cada llamada. El problema se reduce exponencialmente hacia el caso base.",
    formula: "T(n) = T(n/2) + O(1) → T(n) = O(log n)",
    space: "O(log n) — profundidad del call stack es logarítmica",
    examples: [
      { n: 8, ops: 3, calc: "stern(8)→stern(4)→stern(2)→stern(1): 3 pasos" },
      { n: 16, ops: 4, calc: "stern(16)→stern(8)→stern(4)→stern(2)→stern(1): 4 pasos" },
      { n: 1024, ops: 10, calc: "log₂(1024) = 10 pasos máximo" },
    ],
  },
  {
    id: "multibase",
    name: "Múltiples Casos Base",
    example: "Pascal",
    bigO: "O(2ⁿ)",
    bigOmega: "Ω(2ⁿ)",
    bigTheta: "Θ(2ⁿ)",
    littleO: "o(3ⁿ)",
    color: colors.twon,
    curveKey: "twon",
    description:
      "Genera dos llamadas recursivas por paso. El árbol de llamadas crece exponencialmente. Con memoización se reduce a O(n²).",
    formula: "T(n) = 2T(n-1) + O(1) → T(n) = O(2ⁿ)",
    space: "O(n) — profundidad máxima del árbol de llamadas",
    examples: [
      { n: 3, ops: 7, calc: "pascal(3,1): 7 nodos en árbol (2³-1)" },
      { n: 5, ops: 31, calc: "pascal(5,2): ~31 nodos en árbol (2⁵-1)" },
      { n: 10, ops: 1023, calc: "pascal(10,5): ~1023 nodos (2¹⁰-1)" },
    ],
  },
  {
    id: "multillamadas",
    name: "Múltiples Llamadas Recursivas",
    example: "Catalan",
    bigO: "O(4ⁿ/n^1.5)",
    bigOmega: "Ω(2ⁿ)",
    bigTheta: "Θ(4ⁿ/n^1.5)",
    littleO: "o(4ⁿ)",
    color: colors.fourN,
    curveKey: "fourN",
    description:
      "Genera n llamadas por iteración en un bucle. El árbol de llamadas crece más rápido que exponencial. Requiere memoización para ser práctico.",
    formula: "T(n) = Σ T(i)·T(n-i-1) para i=0..n-1 → T(n) ≈ O(4ⁿ/n^1.5)",
    space: "O(n) — profundidad máxima de la recursión",
    examples: [
      { n: 3, ops: 13, calc: "catalan(3): C(0),C(1),C(2) × 2 + C(3) = ~13 llamadas" },
      { n: 5, ops: 41, calc: "catalan(5): ~41 llamadas sin memoización" },
      { n: 10, ops: 16796, calc: "catalan(10): ~16796 llamadas sin memoización" },
    ],
  },
  {
    id: "acumulador",
    name: "Recursión de Cola con Acumulador",
    example: "Factorial con acum.",
    bigO: "O(n)",
    bigOmega: "Ω(n)",
    bigTheta: "Θ(n)",
    littleO: "o(n²)",
    color: colors.n2,
    curveKey: "n",
    description:
      "Mismo tiempo que recursión lineal, pero con espacio O(1) cuando el compilador aplica TCO. Sin TCO (como Python), el espacio sigue siendo O(n).",
    formula: "T(n) = T(n-1) + O(1) → T(n) = O(n), Space = O(1) con TCO",
    space: "O(1) con TCO / O(n) sin TCO (Python)",
    examples: [
      { n: 5, ops: 5, calc: "factorial(5,1)→(4,5)→(3,20)→(2,60)→(1,120)→(0,120)" },
      { n: 10, ops: 10, calc: "factorial(10,1): 10 llamadas, mismo que sin acumulador" },
      { n: 100, ops: 100, calc: "factorial(100,1): 100 llamadas, pero sin operaciones pendientes" },
    ],
  },
];

function generateData() {
  const data = [];
  for (let n = 1; n <= 20; n++) {
    data.push({
      n,
      logn: Math.log2(n),
      n: n,
      n2: n * n,
      twon: Math.min(Math.pow(2, n), 1000000),
      fourN: Math.min(Math.pow(4, n) / Math.pow(n, 1.5), 1000000),
    });
  }
  return data;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0a0a0f",
        border: "1px solid #2a2a3a",
        padding: "12px",
        borderRadius: "8px",
        fontSize: "12px",
      }}>
        <p style={{ color: "#fff", marginBottom: 6 }}>n = {label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, margin: "3px 0" }}>
            {p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [selected, setSelected] = useState("lineal");
  const [visibleCurves, setVisibleCurves] = useState({
    logn: true, n: true, n2: true, twon: true, fourN: false,
  });
  const [scale, setScale] = useState("linear");

  const data = generateData();
  const current = recursionTypes.find((r) => r.id === selected);

  const toggleCurve = (key) => {
    setVisibleCurves((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const curveLabels = {
    logn: "O(log n)",
    n: "O(n)",
    n2: "O(n²)",
    twon: "O(2ⁿ)",
    fourN: "O(4ⁿ/n^1.5)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070d",
      color: "#e8e8f0",
      fontFamily: "'Courier New', monospace",
      padding: "24px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #00f5d4, #fee440)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: 28,
          fontWeight: "bold",
          letterSpacing: 2,
          marginBottom: 4,
        }}>
          COMPLEJIDAD ALGORÍTMICA
        </div>
        <div style={{ color: "#5a5a7a", fontSize: 13, letterSpacing: 3 }}>
          ANÁLISIS DE RECURSIÓN · BIG O · LITTLE O · OMEGA · THETA
        </div>
      </div>

      {/* Notation explanation */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        marginBottom: 28,
      }}>
        {[
          { symbol: "O(f)", name: "Big O", desc: "Cota superior. El algoritmo no crece más que f(n)." },
          { symbol: "Ω(f)", name: "Big Omega", desc: "Cota inferior. El algoritmo no crece menos que f(n)." },
          { symbol: "Θ(f)", name: "Theta", desc: "Cota ajustada. Cota superior e inferior a la vez." },
          { symbol: "o(f)", name: "Little o", desc: "Cota superior estricta. Crece estrictamente menos que f(n)." },
        ].map((n) => (
          <div key={n.symbol} style={{
            background: "#0f0f1a",
            border: "1px solid #1e1e30",
            borderRadius: 8,
            padding: "14px",
          }}>
            <div style={{ color: "#00f5d4", fontSize: 20, fontWeight: "bold", marginBottom: 4 }}>{n.symbol}</div>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: "bold", marginBottom: 4 }}>{n.name}</div>
            <div style={{ color: "#5a5a7a", fontSize: 11, lineHeight: 1.5 }}>{n.desc}</div>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div style={{
        background: "#0f0f1a",
        border: "1px solid #1e1e30",
        borderRadius: 12,
        padding: 20,
        marginBottom: 28,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>CURVAS DE COMPLEJIDAD</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["linear", "log"].map((s) => (
              <button key={s} onClick={() => setScale(s)} style={{
                background: scale === s ? "#00f5d4" : "#1e1e30",
                color: scale === s ? "#000" : "#888",
                border: "none",
                borderRadius: 4,
                padding: "4px 10px",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
              }}>
                {s === "linear" ? "LINEAL" : "LOGARÍTMICA"}
              </button>
            ))}
          </div>
        </div>

        {/* Curve toggles */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {Object.entries(curveLabels).map(([key, label]) => (
            <button key={key} onClick={() => toggleCurve(key)} style={{
              background: visibleCurves[key] ? colors[key] + "20" : "#1e1e30",
              color: visibleCurves[key] ? colors[key] : "#444",
              border: `1px solid ${visibleCurves[key] ? colors[key] : "#2a2a3a"}`,
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}>
              {label}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" />
            <XAxis dataKey="n" stroke="#444" tick={{ fill: "#666", fontSize: 11 }} label={{ value: "n", position: "insideRight", fill: "#666" }} />
            <YAxis stroke="#444" tick={{ fill: "#666", fontSize: 11 }} scale={scale} domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#888" }} />
            {visibleCurves.logn && <Line type="monotone" dataKey="logn" stroke={colors.logn} dot={false} strokeWidth={2} name="O(log n)" />}
            {visibleCurves.n && <Line type="monotone" dataKey="n" stroke={colors.n} dot={false} strokeWidth={2} name="O(n)" />}
            {visibleCurves.n2 && <Line type="monotone" dataKey="n2" stroke={colors.n2} dot={false} strokeWidth={2} name="O(n²)" />}
            {visibleCurves.twon && <Line type="monotone" dataKey="twon" stroke={colors.twon} dot={false} strokeWidth={2} name="O(2ⁿ)" />}
            {visibleCurves.fourN && <Line type="monotone" dataKey="fourN" stroke={colors.fourN} dot={false} strokeWidth={2} name="O(4ⁿ/n^1.5)" />}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recursion type selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {recursionTypes.map((r) => (
          <button key={r.id} onClick={() => setSelected(r.id)} style={{
            background: selected === r.id ? r.color + "20" : "#0f0f1a",
            color: selected === r.id ? r.color : "#555",
            border: `1px solid ${selected === r.id ? r.color : "#1e1e30"}`,
            borderRadius: 6,
            padding: "8px 14px",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            letterSpacing: 1,
          }}>
            {r.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {current && (
        <div style={{
          background: "#0f0f1a",
          border: `1px solid ${current.color}40`,
          borderRadius: 12,
          padding: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ color: current.color, fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
                {current.name}
              </div>
              <div style={{ color: "#5a5a7a", fontSize: 12 }}>Ejemplo: {current.example}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: current.color, fontSize: 22, fontWeight: "bold" }}>{current.bigTheta}</div>
              <div style={{ color: "#5a5a7a", fontSize: 11 }}>COMPLEJIDAD AJUSTADA</div>
            </div>
          </div>

          <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
            {current.description}
          </div>

          {/* Notation grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
            {[
              { label: "Big O", value: current.bigO, desc: "Peor caso" },
              { label: "Omega Ω", value: current.bigOmega, desc: "Mejor caso" },
              { label: "Theta Θ", value: current.bigTheta, desc: "Caso promedio" },
              { label: "little o", value: current.littleO, desc: "Cota estricta" },
            ].map((n) => (
              <div key={n.label} style={{
                background: "#07070d",
                border: `1px solid ${current.color}30`,
                borderRadius: 8,
                padding: "12px",
                textAlign: "center",
              }}>
                <div style={{ color: "#5a5a7a", fontSize: 10, letterSpacing: 2, marginBottom: 4 }}>{n.label.toUpperCase()}</div>
                <div style={{ color: current.color, fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>{n.value}</div>
                <div style={{ color: "#444", fontSize: 10 }}>{n.desc}</div>
              </div>
            ))}
          </div>

          {/* Formula */}
          <div style={{
            background: "#07070d",
            border: "1px solid #1e1e30",
            borderRadius: 8,
            padding: "14px",
            marginBottom: 24,
            fontFamily: "monospace",
          }}>
            <div style={{ color: "#5a5a7a", fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>RECURRENCIA</div>
            <div style={{ color: "#00f5d4", fontSize: 13 }}>{current.formula}</div>
            <div style={{ color: "#5a5a7a", fontSize: 11, marginTop: 8 }}>Espacio: {current.space}</div>
          </div>

          {/* Calculated examples */}
          <div>
            <div style={{ color: "#5a5a7a", fontSize: 10, letterSpacing: 2, marginBottom: 12 }}>EJEMPLOS CALCULADOS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {current.examples.map((ex, idx) => (
                <div key={idx} style={{
                  background: "#07070d",
                  border: `1px solid ${current.color}20`,
                  borderRadius: 8,
                  padding: "14px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#5a5a7a", fontSize: 11 }}>n = {ex.n}</span>
                    <span style={{ color: current.color, fontWeight: "bold", fontSize: 14 }}>
                      ~{ex.ops.toLocaleString()} ops
                    </span>
                  </div>
                  <div style={{ color: "#666", fontSize: 10, lineHeight: 1.6 }}>{ex.calc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary table */}
      <div style={{
        background: "#0f0f1a",
        border: "1px solid #1e1e30",
        borderRadius: 12,
        padding: 20,
        marginTop: 24,
      }}>
        <div style={{ color: "#5a5a7a", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>TABLA COMPARATIVA</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Tipo", "Big O", "Ω", "Θ", "little o", "Espacio"].map((h) => (
                  <th key={h} style={{
                    color: "#5a5a7a",
                    textAlign: "left",
                    padding: "8px 12px",
                    borderBottom: "1px solid #1e1e30",
                    letterSpacing: 1,
                    fontSize: 10,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recursionTypes.map((r) => (
                <tr key={r.id} onClick={() => setSelected(r.id)} style={{
                  cursor: "pointer",
                  background: selected === r.id ? r.color + "10" : "transparent",
                  transition: "background 0.2s",
                }}>
                  <td style={{ padding: "10px 12px", color: r.color, fontWeight: "bold" }}>{r.example}</td>
                  <td style={{ padding: "10px 12px", color: "#e8e8f0" }}>{r.bigO}</td>
                  <td style={{ padding: "10px 12px", color: "#e8e8f0" }}>{r.bigOmega}</td>
                  <td style={{ padding: "10px 12px", color: "#e8e8f0" }}>{r.bigTheta}</td>
                  <td style={{ padding: "10px 12px", color: "#e8e8f0" }}>{r.littleO}</td>
                  <td style={{ padding: "10px 12px", color: "#666" }}>{r.space.split(" —")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
