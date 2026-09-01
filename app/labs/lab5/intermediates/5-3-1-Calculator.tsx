"use client";

import { useState } from "react";

const OPERATIONS = [
  { label: "+", value: "add" },
  { label: "-", value: "subtract" },
  { label: "×", value: "multiply" },
  { label: "÷", value: "divide" },
];

export default function CalculatorNextWebApiClient() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const calculate = async (op?: string) => {
    const nextOp = op ?? operation;
    setOperation(nextOp);
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/lab5/calculator?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&operation=${nextOp}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unknown error");
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Failed to reach the server");
    } finally {
      setLoading(false);
    }
  };
  const operationSymbol =
    OPERATIONS.find((op) => op.value === operation)?.label ?? "";
  return (
    <div id="wd-lab5-next-calculator" className="p-2">
      <h3>Calculator (Next.js Web API)</h3>
      <label htmlFor="a-input" className="mr-2">
        A:
      </label>
      <input
        type="number"
        value={a}
        placeholder="A"
        id="a-input"
        className="mb-2 rounded border border-neutral-300 px-2 py-1"
        onChange={(e) => setA(e.target.value)}
      />
      <br />
      <label htmlFor="b-input" className="mr-2">
        B:
      </label>
      <input
        type="number"
        value={b}
        placeholder="B"
        id="b-input"
        className="mb-2 rounded border border-neutral-300 px-2 py-1"
        onChange={(e) => setB(e.target.value)}
      />
      <br />
      <label htmlFor="operation-select" className="mr-2">
        Operation:
      </label>
      <select
        id="operation-select"
        value={operation}
        className="mb-2 rounded border border-neutral-300 px-2 py-1"
        onChange={(e) => {
          calculate(e.target.value);
        }}
      >
        {OPERATIONS.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      <br />
      <button
        type="button"
        className="mt-2 rounded bg-blue-600 px-4 py-1.5 text-white disabled:opacity-50"
        disabled={loading || a === "" || b === ""}
        onClick={() => calculate(operation)}
      >
        {loading ? "Calculating..." : "Calculate"}
      </button>
      <br />
      {result !== null ? (
        <p className="mt-2">
          Result: {a} {operationSymbol} {b} = {result}
        </p>
      ) : null}
      {error ? <p className="mt-2 text-red-700">{error}</p> : null}
      <hr />
    </div>
  );
}
