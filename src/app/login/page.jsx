"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    riskProfile: "balanced",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();

    setLoading(false);
    if (!json.success) {
      setMessage(json.message || "Request failed.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">Investor Account</h1>
      <p className="mt-2 text-sm text-gray-400">
        Personalize watchlists, holdings, alerts, paper trades, and AI insights.
      </p>

      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-6 grid grid-cols-2 rounded-lg bg-gray-950 p-1">
          {["login", "register"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-md px-4 py-2 text-sm font-medium capitalize ${
                mode === item
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="grid gap-4">
          {mode === "register" && (
            <>
              <Field label="Name">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Risk Profile">
                <select
                  value={form.riskProfile}
                  onChange={(e) => update("riskProfile", e.target.value)}
                  className="input"
                >
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </Field>
            </>
          )}

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="input"
            />
          </Field>

          {message && <p className="text-sm text-red-400">{message}</p>}

          <button
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-gray-400">
      {label}
      {children}
    </label>
  );
}
