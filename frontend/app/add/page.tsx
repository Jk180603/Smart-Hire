"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addApplication } from "@/lib/api";

export default function AddApplication() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    company_name: "",
    role: "",
    url: "",
    notes: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_name || !form.role) {
      setError("Company name and role are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await addApplication(form);
      router.push("/");
    } catch {
      setError("Failed to add application. Is the backend running?");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Add Application</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Company Name *
            </label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              placeholder="e.g. Microsoft"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl
                px-4 py-3 text-white text-sm placeholder-gray-600
                focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Role *
            </label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. AI for Science Intern"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl
                px-4 py-3 text-white text-sm placeholder-gray-600
                focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Job URL
            </label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://linkedin.com/jobs/..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl
                px-4 py-3 text-white text-sm placeholder-gray-600
                focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="e.g. Applied via LinkedIn, English only, no German needed"
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl
                px-4 py-3 text-white text-sm placeholder-gray-600
                focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700
              disabled:text-gray-500 text-white font-medium py-3 rounded-xl
              text-sm transition-colors"
          >
            {loading ? "Adding..." : "Add Application"}
          </button>

        </form>
      </div>
    </main>
  );
}