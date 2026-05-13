"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Quote } from "@/lib/types";
import { formatCOP } from "@/lib/types";
import { Suspense } from "react";

function ResultadoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/quotes/${id}`)
        .then((r) => r.json())
        .then(setQuote);
    }
  }, [id]);

  async function downloadPDF() {
    setGenerating(true);
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    if (!quote) return;

    const doc = new jsPDF();
    const features: string[] = JSON.parse(quote.package.features);

    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text("Cotización de Evento", 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Cotización #${quote.id}`, 20, 33);
    doc.text(
      `Fecha: ${new Date(quote.createdAt).toLocaleDateString("es-CO")}`,
      20,
      38
    );

    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text("Datos del Cliente", 20, 52);

    const clientData = [
      ["Nombre", quote.clientName],
      ["Email", quote.clientEmail],
      ["Teléfono", quote.clientPhone],
      ["Tipo de evento", quote.eventType.name],
      ["Fecha", quote.eventDate],
      ["Lugar", quote.eventLocation],
      ["Invitados", String(quote.guestCount)],
    ];

    autoTable(doc, {
      startY: 56,
      head: [],
      body: clientData,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 40, textColor: [100, 100, 100] },
        1: { textColor: [30, 30, 30] },
      },
    });

    const afterClient = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text("Paquete Seleccionado", 20, afterClient);

    autoTable(doc, {
      startY: afterClient + 4,
      head: [["Concepto", "Valor"]],
      body: [
        [
          `${quote.package.name}\n${features.join(", ")}`,
          formatCOP(quote.package.basePrice),
        ],
      ],
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    if (quote.services.length > 0) {
      const afterPkg = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text("Servicios Adicionales", 20, afterPkg);

      autoTable(doc, {
        startY: afterPkg + 4,
        head: [["Servicio", "Valor"]],
        body: quote.services.map((qs) => [
          qs.service.name,
          formatCOP(qs.service.price),
        ]),
        theme: "striped",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] },
      });
    }

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFillColor(238, 242, 255);
    doc.roundedRect(20, finalY, 170, 20, 3, 3, "F");
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text("TOTAL ESTIMADO:", 25, finalY + 13);
    doc.setFontSize(16);
    doc.text(formatCOP(quote.totalPrice), 130, finalY + 13);

    doc.save(`cotizacion-${quote.id}.pdf`);
    setGenerating(false);
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const features: string[] = JSON.parse(quote.package.features);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800">
            ¡Cotización generada!
          </h1>
          <p className="text-gray-500 mt-2">
            Cotización #{quote.id} - Te contactaremos pronto
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Datos del evento
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-500">Cliente</div>
              <div className="text-gray-800 font-medium">
                {quote.clientName}
              </div>
              <div className="text-gray-500">Tipo de evento</div>
              <div className="text-gray-800">{quote.eventType.name}</div>
              <div className="text-gray-500">Fecha</div>
              <div className="text-gray-800">{quote.eventDate}</div>
              <div className="text-gray-500">Lugar</div>
              <div className="text-gray-800">{quote.eventLocation}</div>
              <div className="text-gray-500">Invitados</div>
              <div className="text-gray-800">{quote.guestCount}</div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Paquete: {quote.package.name}
            </h3>
            <ul className="space-y-1 mb-3">
              {features.map((f) => (
                <li key={f} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="text-right font-semibold text-gray-800">
              {formatCOP(quote.package.basePrice)}
            </div>
          </div>

          {quote.services.length > 0 && (
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Servicios adicionales
              </h3>
              <div className="space-y-2">
                {quote.services.map((qs) => (
                  <div
                    key={qs.service.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-700">{qs.service.name}</span>
                    <span className="text-gray-800 font-medium">
                      {formatCOP(qs.service.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 bg-indigo-50 rounded-b-xl">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">
                Total estimado
              </span>
              <span className="text-2xl font-bold text-indigo-600">
                {formatCOP(quote.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={downloadPDF}
            disabled={generating}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-300"
          >
            {generating ? "Generando..." : "📄 Descargar PDF"}
          </button>
          <a
            href="/cotizar"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Nueva cotización
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      }
    >
      <ResultadoContent />
    </Suspense>
  );
}
