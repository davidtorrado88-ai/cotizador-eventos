import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#0a0a0f] to-indigo-950">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-400">EventosPro</div>
        <Link
          href="/admin"
          className="text-sm text-gray-400 hover:text-gray-200"
        >
          Admin
        </Link>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-100 leading-tight mb-6">
          Planifica tu evento
          <br />
          <span className="text-indigo-400">perfecto</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Cotiza en minutos. Elige tu paquete, personaliza con servicios
          adicionales y recibe tu cotización al instante.
        </p>
        <Link
          href="/cotizar"
          className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/50"
        >
          Cotizar ahora →
        </Link>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="text-left p-6 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="text-3xl mb-4">💒</div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Bodas</h3>
            <p className="text-gray-400 text-sm">
              Desde ceremonias íntimas hasta grandes celebraciones. Paquetes
              desde $2.500.000.
            </p>
          </div>
          <div className="text-left p-6 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="text-3xl mb-4">🏢</div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Corporativos
            </h3>
            <p className="text-gray-400 text-sm">
              Conferencias, lanzamientos y team buildings con imagen profesional.
              Paquetes desde $3.000.000.
            </p>
          </div>
          <div className="text-left p-6 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="text-3xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Sociales
            </h3>
            <p className="text-gray-400 text-sm">
              Cumpleaños, quinceañeras y más. Celebraciones memorables desde
              $1.500.000.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-100 mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Elige tu evento",
                desc: "Selecciona el tipo de evento que deseas realizar",
              },
              {
                step: "2",
                title: "Comparte tus datos",
                desc: "Cuéntanos los detalles: fecha, lugar e invitados",
              },
              {
                step: "3",
                title: "Selecciona paquete",
                desc: "Elige el paquete que mejor se ajuste a tus necesidades",
              },
              {
                step: "4",
                title: "Recibe tu cotización",
                desc: "Obtén el precio al instante y descarga tu PDF",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-100 mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EventosPro - Cotizador de Eventos
      </footer>
    </div>
  );
}
