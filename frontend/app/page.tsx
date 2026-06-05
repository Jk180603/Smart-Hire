"use client";

import { useEffect, useState } from "react";
import {
  getApplications,
  getStats,
  updateStatus,
} from "@/lib/api";
import type {
  Application,
  DashboardStats,
  AppStatus,
} from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const STATUS_COLORS: Record<AppStatus, string> = {
  applied: "#3B82F6",
  interview: "#F59E0B",
  offer: "#10B981",
  rejected: "#EF4444",
};

interface ChartItem {
  name: string;
  value: number;
  color: string;
}

export default function Dashboard() {
  const [apps, setApps] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function load() {
    const [a, s] = await Promise.all([
      getApplications(),
      getStats(),
    ]);
    setApps(a);
    setStats(s);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatus(id: number, status: AppStatus) {
    await updateStatus(id, status);
    await load();
  }

  const chartData: ChartItem[] = stats
    ? [
        { name: "Applied", value: stats.applied, color: "#3B82F6" },
        { name: "Interview", value: stats.interviews, color: "#F59E0B" },
        { name: "Offers", value: stats.offers, color: "#10B981" },
        { name: "Rejected", value: stats.rejected, color: "#EF4444" },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading SmartHire AI...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">SmartHire AI</h1>
        <p className="text-gray-400 mt-1">
          Track your job search · AI-powered match scoring
        </p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total",
              val: stats.total,
              color: "text-white",
            },
            {
              label: "Interviews",
              val: stats.interviews,
              color: "text-yellow-400",
            },
            {
              label: "Offers",
              val: stats.offers,
              color: "text-green-400",
            },
            {
              label: "Avg Score",
              val: `${stats.avg_match_score}%`,
              color: "text-blue-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <p className="text-gray-400 text-sm mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {stats && chartData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <h2 className="text-sm font-medium text-gray-400 mb-4">
            Application Pipeline
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "none",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Applications list */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-400">
            Applications ({apps.length})
          </h2>
          <a
            href="/add"
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            + Add New
          </a>
        </div>

        <div className="divide-y divide-gray-800">
          {apps.length === 0 ? (
            <p className="text-gray-500 text-sm p-6 text-center">
              No applications yet. Click + Add New to start.
            </p>
          ) : (
            apps.map((app) => (
              <div
                key={app.id}
                className="px-4 py-3 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {app.company}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {app.role}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-xs font-medium"
                    style={{
                      color:
                        app.match_score > 0
                          ? STATUS_COLORS[app.status]
                          : "#6B7280",
                    }}
                  >
                    {app.match_score > 0
                      ? `${app.match_score}%`
                      : "Not analysed"}
                  </span>

                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleStatus(app.id, e.target.value as AppStatus)
                    }
                    className="text-xs bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1 cursor-pointer"
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}