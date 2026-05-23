"use client";

import { useEffect, useState } from "react";
import type { Quote } from "@/lib/types";
import { formatCOP } from "@/lib/types";

export default function AdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quotes")
      .then((r) => r.json())
      .then((data) => {
        setQuotes(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400" />
      </div>
    );
  }

  const totalRevenue = quotes.reduce((sum, q) => sum + q.totalPrice, 0);
  const pendingQuotes = quotes.filter((q) => q.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-100">
            Panel de Administración
          </h1>
          <a
            href="/"
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-sm text-gray-400">Total cotizaciones</div>
            <div className="text-3xl font-bold text-gray-100">
              {quotes.length}
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-sm text-gray-400">Pendientes</div>
            <div className="text-3xl font-bold text-amber-400">
              {pendingQuotes}
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-sm text-gray-400">Valor total cotizado</div>
            <div className="text-3xl font-bold text-green-400">
              {formatCOP(totalRevenue)}
            </div>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-gray-100">
              Cotizaciones recibidas
            </h2>
          </div>
          {quotes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No hay cotizaciones aún
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Paquete
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Fecha evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Creada
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {q.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-200">
                          {q.clientName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {q.clientEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {q.eventType.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {q.package.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {q.eventDate}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-200">
                        {formatCOP(q.totalPrice)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            q.status === "pending"
                              ? "bg-amber-900/50 text-amber-400"
                              : q.status === "approved"
                                ? "bg-green-900/50 text-green-400"
                                : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {q.status === "pending"
                            ? "Pendiente"
                            : q.status === "approved"
                              ? "Aprobada"
                              : q.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(q.createdAt).toLocaleDateString("es-CO")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
