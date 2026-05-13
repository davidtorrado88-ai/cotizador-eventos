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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const totalRevenue = quotes.reduce((sum, q) => sum + q.totalPrice, 0);
  const pendingQuotes = quotes.filter((q) => q.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Panel de Administración
          </h1>
          <a
            href="/"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-sm text-gray-500">Total cotizaciones</div>
            <div className="text-3xl font-bold text-gray-800">
              {quotes.length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-sm text-gray-500">Pendientes</div>
            <div className="text-3xl font-bold text-amber-600">
              {pendingQuotes}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-sm text-gray-500">Valor total cotizado</div>
            <div className="text-3xl font-bold text-green-600">
              {formatCOP(totalRevenue)}
            </div>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
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
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Paquete
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Creada
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {q.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">
                          {q.clientName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {q.clientEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {q.eventType.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {q.package.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {q.eventDate}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {formatCOP(q.totalPrice)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            q.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : q.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
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
