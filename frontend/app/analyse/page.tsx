"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApplications, analyseApplication } from "@/lib/api";
import type { Application } from "@/lib/api";

interface JdAnalysis {
  required_skills?: string[];
  nice_to_have?: string[];
  key_technologies?: string[];
  role_summary?: string;
  error?: string;
}

interface AnalyseResult {
  match_score: number;
  jd_analysis: JdAnalysis;
  feedback: string;
}

async function extractTextFromPdf(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        resolve(text.trim());
      } catch {
        resolve("");
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

export default function AnalysePage() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [jdText, setJdText] = useState("");
  const [cvText, setCvText] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdMode, setJdMode] = useState<"text" | "pdf">("text");
  const [cvMode, setCvMode] = useState<"text" | "pdf">("text");
  const [result, setResult] = useState<AnalyseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => {
    getApplications().then((data) => {
      setApps(data);
      if (data.length > 0) setSelectedId(data[0].id);
    });
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => setPdfReady(true);
    document.head.appendChild(script);
  }, []);

  async function handleFileUpload(file: File, type: "cv" | "jd") {
    if (!pdfReady) {
      setError("PDF reader loading, please wait a moment.");
      return;
    }
    setExtracting(true);
    const text = await extractTextFromPdf(file);
    if (text.length < 50) {
      setError("Could not extract text. Try a text-based PDF or paste manually.");
    } else {
      setError("");
      if (type === "cv") setCvText(text);
      else setJdText(text);
    }
    setExtracting(false);
  }

  async function handleAnalyse() {
    if (!selectedId) { setError("Select an application first."); return; }
    if (!jdText.trim()) { setError("Provide the job description."); return; }
    if (!cvText.trim()) { setError("Provide your CV text."); return; }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await analyseApplication({
        application_id: selectedId,
        jd_text: jdText,
        cv_text: cvText,
      });
      setResult(res as AnalyseResult);
    } catch {
      setError("Analysis failed. Make sure backend is running.");
    }
    setLoading(false);
  }

  function scoreColor(s: number) {
    if (s >= 75) return "text-green-400";
    if (s >= 50) return "text-yellow-400";
    return "text-red-400";
  }

  function scoreLabel(s: number) {
    if (s >= 75) return "Strong Match";
    if (s >= 50) return "Moderate Match";
    return "Weak Match — needs improvement";
  }

  const inputClass = `w-full bg-gray-800 border border-gray-700 rounded-xl
    px-4 py-3 text-white text-sm placeholder-gray-600
    focus:outline-none focus:border-blue-500 resize-none`;

  const tabClass = (active: boolean) =>
    `text-xs px-3 py-1 rounded-lg transition-colors ${
      active ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
    }`;

  function UploadBox({ file, onFile, label }: { file: File | null; onFile: (f: File) => void; label: string }) {
    return (
      <label className="flex flex-col items-center justify-center w-full h-28
        border-2 border-dashed border-gray-700 rounded-xl cursor-pointer
        hover:border-blue-500 transition-colors bg-gray-800">
        <input type="file" accept=".pdf" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        <p className="text-gray-400 text-sm">{file ? file.name : label}</p>
        <p className="text-gray-600 text-xs mt-1">PDF only</p>
      </label>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white text-sm">← Back</button>
          <div>
            <h1 className="text-2xl font-bold">AI Match Analyser</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Upload CV and JD — get your match score and AI feedback
            </p>
          </div>
        </div>

        {/* Select application */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-1 block">Link to Application</label>
          <select value={selectedId} onChange={(e) => setSelectedId(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl
              px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
            <option value={0}>Select application...</option>
            {apps.map((a) => (
              <option key={a.id} value={a.id}>{a.company} — {a.role}</option>
            ))}
          </select>
        </div>

        {/* JD */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-white">Job Description</h3>
            <div className="flex gap-2">
              <button className={tabClass(jdMode === "text")} onClick={() => setJdMode("text")}>Paste Text</button>
              <button className={tabClass(jdMode === "pdf")} onClick={() => setJdMode("pdf")}>Upload PDF</button>
            </div>
          </div>
          {jdMode === "text"
            ? <textarea value={jdText} onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..." rows={6} className={inputClass} />
            : <div>
                <UploadBox file={jdFile} label="Click to upload JD PDF"
                  onFile={async (f) => { setJdFile(f); await handleFileUpload(f, "jd"); }} />
                {jdText && <p className="text-green-400 text-xs mt-2">✓ Extracted {jdText.length} characters</p>}
              </div>
          }
        </div>

        {/* CV */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-white">Your CV</h3>
            <div className="flex gap-2">
              <button className={tabClass(cvMode === "text")} onClick={() => setCvMode("text")}>Paste Text</button>
              <button className={tabClass(cvMode === "pdf")} onClick={() => setCvMode("pdf")}>Upload PDF</button>
            </div>
          </div>
          {cvMode === "text"
            ? <textarea value={cvText} onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV text here..." rows={6} className={inputClass} />
            : <div>
                <UploadBox file={cvFile} label="Click to upload CV PDF"
                  onFile={async (f) => { setCvFile(f); await handleFileUpload(f, "cv"); }} />
                {cvText && <p className="text-green-400 text-xs mt-2">✓ Extracted {cvText.length} characters</p>}
              </div>
          }
        </div>

        {extracting && <p className="text-blue-400 text-sm mb-4">Extracting text from PDF...</p>}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button onClick={handleAnalyse} disabled={loading || extracting}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700
            disabled:text-gray-500 text-white font-medium py-3 rounded-xl
            text-sm transition-colors mb-8">
          {loading ? "Analysing with AI... (10–15 seconds)" : "Analyse Match"}
        </button>

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-4">

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Match Score</p>
              <p className={`text-6xl font-bold ${scoreColor(result.match_score)}`}>
                {result.match_score}%
              </p>
              <p className={`text-sm mt-2 font-medium ${scoreColor(result.match_score)}`}>
                {scoreLabel(result.match_score)}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Based on semantic similarity between your CV and the job description
              </p>
            </div>

            {result.jd_analysis && !result.jd_analysis.error && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                {result.jd_analysis.role_summary && (
                  <>
                    <h3 className="text-sm font-medium text-white mb-2">Role Summary</h3>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                      {result.jd_analysis.role_summary}
                    </p>
                  </>
                )}

                {result.jd_analysis.required_skills && result.jd_analysis.required_skills.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.jd_analysis.required_skills.map((s) => (
                        <span key={s} className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-lg">{s}</span>
                      ))}
                    </div>
                  </>
                )}

                {result.jd_analysis.key_technologies && result.jd_analysis.key_technologies.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Key Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.jd_analysis.key_technologies.map((t) => (
                        <span key={t} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg border border-gray-700">{t}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-3">AI Career Coach Feedback</h3>
              <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {result.feedback}
              </p>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}