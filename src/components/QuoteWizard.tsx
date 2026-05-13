"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { EventType, Package, Service, QuoteFormData } from "@/lib/types";
import { formatCOP } from "@/lib/types";

const STEPS = [
  "Tipo de Evento",
  "Tus Datos",
  "Paquete",
  "Servicios Extra",
  "Resumen",
];

export default function QuoteWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<QuoteFormData>({
    eventTypeId: 0,
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventDate: "",
    eventLocation: "",
    guestCount: 50,
    budgetMin: 0,
    budgetMax: 0,
    packageId: 0,
    serviceIds: [],
  });

  useEffect(() => {
    fetch("/api/event-types")
      .then((r) => r.json())
      .then(setEventTypes);
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices);
  }, []);

  const selectedEventType = eventTypes.find((e) => e.id === form.eventTypeId);
  const selectedPackage = selectedEventType?.packages.find(
    (p) => p.id === form.packageId
  );
  const selectedServices = services.filter((s) =>
    form.serviceIds.includes(s.id)
  );

  const totalPrice =
    (selectedPackage?.basePrice ?? 0) +
    selectedServices.reduce((sum, s) => sum + s.price, 0);

  function canAdvance(): boolean {
    switch (step) {
      case 0:
        return form.eventTypeId > 0;
      case 1:
        return !!(
          form.clientName &&
          form.clientEmail &&
          form.clientPhone &&
          form.eventDate &&
          form.eventLocation &&
          form.guestCount > 0
        );
      case 2:
        return form.packageId > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, totalPrice }),
    });
    const quote = await res.json();
    router.push(`/cotizar/resultado?id=${quote.id}`);
  }

  const servicesByCategory = services.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {} as Record<string, Service[]>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`text-xs font-medium ${i <= step ? "text-indigo-600" : "text-gray-400"}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 0: Event Type */}
      {step === 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            ¿Qué tipo de evento planeas?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventTypes.map((et) => (
              <button
                key={et.id}
                onClick={() => setForm({ ...form, eventTypeId: et.id, packageId: 0 })}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  form.eventTypeId === et.id
                    ? "border-indigo-600 bg-indigo-50 shadow-lg"
                    : "border-gray-200 hover:border-indigo-300 hover:shadow"
                }`}
              >
                <div className="text-3xl mb-3">
                  {et.slug === "bodas"
                    ? "💒"
                    : et.slug === "corporativos"
                      ? "🏢"
                      : "🎉"}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {et.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {et.packages.length} paquetes disponibles
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Client Data */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Cuéntanos sobre tu evento
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) =>
                    setForm({ ...form, clientEmail: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={form.clientPhone}
                  onChange={(e) =>
                    setForm({ ...form, clientPhone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  placeholder="+57 300 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha del evento
                </label>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) =>
                    setForm({ ...form, eventDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lugar del evento
              </label>
              <input
                type="text"
                value={form.eventLocation}
                onChange={(e) =>
                  setForm({ ...form, eventLocation: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                placeholder="Ciudad o dirección"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de invitados
                </label>
                <input
                  type="number"
                  value={form.guestCount}
                  onChange={(e) =>
                    setForm({ ...form, guestCount: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto mínimo
                </label>
                <input
                  type="number"
                  value={form.budgetMin || ""}
                  onChange={(e) =>
                    setForm({ ...form, budgetMin: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  placeholder="Ej: 3000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto máximo
                </label>
                <input
                  type="number"
                  value={form.budgetMax || ""}
                  onChange={(e) =>
                    setForm({ ...form, budgetMax: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  placeholder="Ej: 10000000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Package Selection */}
      {step === 2 && selectedEventType && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Elige tu paquete para {selectedEventType.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedEventType.packages.map((pkg) => {
              const features: string[] = JSON.parse(pkg.features);
              return (
                <button
                  key={pkg.id}
                  onClick={() => setForm({ ...form, packageId: pkg.id })}
                  className={`p-6 rounded-xl border-2 transition-all text-left flex flex-col ${
                    form.packageId === pkg.id
                      ? "border-indigo-600 bg-indigo-50 shadow-lg"
                      : "border-gray-200 hover:border-indigo-300 hover:shadow"
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      {pkg.description}
                    </p>
                    <ul className="space-y-1.5 mb-4">
                      {features.map((f) => (
                        <li
                          key={f}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-0.5">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatCOP(pkg.basePrice)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Additional Services */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Servicios adicionales
          </h2>
          <p className="text-gray-500 mb-6">
            Selecciona los servicios extra que desees agregar (opcional)
          </p>
          {Object.entries(servicesByCategory).map(([category, svcs]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {svcs.map((svc) => {
                  const selected = form.serviceIds.includes(svc.id);
                  return (
                    <button
                      key={svc.id}
                      onClick={() =>
                        setForm({
                          ...form,
                          serviceIds: selected
                            ? form.serviceIds.filter((id) => id !== svc.id)
                            : [...form.serviceIds, svc.id],
                        })
                      }
                      className={`w-full p-4 rounded-lg border transition-all text-left flex justify-between items-center ${
                        selected
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-800">
                          {svc.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {svc.description}
                        </div>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <div className="font-semibold text-gray-800">
                          {formatCOP(svc.price)}
                        </div>
                        <div
                          className={`text-xs ${selected ? "text-indigo-600 font-semibold" : "text-gray-400"}`}
                        >
                          {selected ? "✓ Incluido" : "Agregar"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && selectedPackage && selectedEventType && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Resumen de tu cotización
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y">
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Datos del evento
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-500">Cliente</div>
                <div className="text-gray-800 font-medium">
                  {form.clientName}
                </div>
                <div className="text-gray-500">Email</div>
                <div className="text-gray-800">{form.clientEmail}</div>
                <div className="text-gray-500">Teléfono</div>
                <div className="text-gray-800">{form.clientPhone}</div>
                <div className="text-gray-500">Tipo de evento</div>
                <div className="text-gray-800">{selectedEventType.name}</div>
                <div className="text-gray-500">Fecha</div>
                <div className="text-gray-800">{form.eventDate}</div>
                <div className="text-gray-500">Lugar</div>
                <div className="text-gray-800">{form.eventLocation}</div>
                <div className="text-gray-500">Invitados</div>
                <div className="text-gray-800">{form.guestCount}</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Paquete seleccionado
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">
                    {selectedPackage.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedPackage.description}
                  </div>
                </div>
                <div className="font-semibold text-gray-800">
                  {formatCOP(selectedPackage.basePrice)}
                </div>
              </div>
            </div>
            {selectedServices.length > 0 && (
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Servicios adicionales
                </h3>
                <div className="space-y-2">
                  {selectedServices.map((svc) => (
                    <div
                      key={svc.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-700">{svc.name}</span>
                      <span className="text-gray-800 font-medium">
                        {formatCOP(svc.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-6 bg-indigo-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">
                  Total estimado
                </span>
                <span className="text-2xl font-bold text-indigo-600">
                  {formatCOP(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(step - 1)}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            step === 0
              ? "invisible"
              : "text-gray-600 bg-gray-100 hover:bg-gray-200"
          }`}
        >
          ← Anterior
        </button>

        {step < 4 && (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance()}
            className="px-6 py-2.5 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        )}
        {step === 4 && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-2.5 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 transition-colors"
          >
            {submitting ? "Enviando..." : "Solicitar Cotización"}
          </button>
        )}
      </div>

      {/* Running total */}
      {step >= 2 && step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <span className="text-gray-600">Total estimado:</span>
            <span className="text-xl font-bold text-indigo-600">
              {formatCOP(totalPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
