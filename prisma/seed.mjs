import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const client = new pg.Client({ connectionString });
await client.connect();

await client.query("DELETE FROM \"QuoteService\"");
await client.query("DELETE FROM \"Quote\"");
await client.query("DELETE FROM \"Package\"");
await client.query("DELETE FROM \"Service\"");
await client.query("DELETE FROM \"EventType\"");

const eventTypes = [
  { name: "Bodas", slug: "bodas" },
  { name: "Corporativos", slug: "corporativos" },
  { name: "Sociales", slug: "sociales" },
];

const etIds = {};
for (const et of eventTypes) {
  const res = await client.query(
    'INSERT INTO "EventType" (name, slug) VALUES ($1, $2) RETURNING id',
    [et.name, et.slug]
  );
  etIds[et.slug] = res.rows[0].id;
}

const packages = [
  ["Básico", "Paquete esencial para eventos íntimos", 2500000, etIds.bodas, JSON.stringify(["Coordinación del día", "Decoración básica", "Sonido ambiente", "Montaje y desmontaje"])],
  ["Premium", "Todo lo del básico más servicios premium", 5500000, etIds.bodas, JSON.stringify(["Coordinación completa", "Decoración temática", "DJ profesional", "Iluminación decorativa", "Centro de mesa", "Montaje y desmontaje"])],
  ["VIP", "La experiencia completa sin preocupaciones", 10000000, etIds.bodas, JSON.stringify(["Planeación integral", "Decoración de lujo", "DJ + banda en vivo", "Iluminación profesional", "Fotografía y video", "Centro de mesa premium", "Candy bar", "Montaje y desmontaje"])],
  ["Básico", "Evento corporativo funcional y profesional", 3000000, etIds.corporativos, JSON.stringify(["Coordinación logística", "Equipo audiovisual", "Señalización", "Montaje y desmontaje"])],
  ["Premium", "Evento corporativo con imagen de marca", 6000000, etIds.corporativos, JSON.stringify(["Coordinación completa", "Branding personalizado", "Equipo AV profesional", "Streaming en vivo", "Registro digital", "Montaje y desmontaje"])],
  ["VIP", "Producción corporativa de alto nivel", 12000000, etIds.corporativos, JSON.stringify(["Producción integral", "Branding 360°", "Equipo AV premium", "Streaming multicámara", "App del evento", "Fotografía y video", "Catering ejecutivo", "Montaje y desmontaje"])],
  ["Básico", "Celebración sencilla y memorable", 1500000, etIds.sociales, JSON.stringify(["Coordinación del día", "Decoración básica", "Sonido", "Montaje y desmontaje"])],
  ["Premium", "Celebración con todos los detalles", 3500000, etIds.sociales, JSON.stringify(["Coordinación completa", "Decoración temática", "DJ", "Iluminación", "Mesa de dulces", "Montaje y desmontaje"])],
  ["VIP", "Celebración espectacular e inolvidable", 7000000, etIds.sociales, JSON.stringify(["Planeación integral", "Decoración de lujo", "DJ + animación", "Iluminación profesional", "Fotografía y video", "Mesa de dulces premium", "Show en vivo", "Montaje y desmontaje"])],
];

for (const [name, description, basePrice, eventTypeId, features] of packages) {
  await client.query(
    'INSERT INTO "Package" (name, description, "basePrice", "eventTypeId", features) VALUES ($1, $2, $3, $4, $5)',
    [name, description, basePrice, eventTypeId, features]
  );
}

const services = [
  ["Catering (por persona)", "Menú completo con entrada, plato fuerte y postre", 85000, "Alimentación"],
  ["Coctelería (por persona)", "Barra de cócteles con bartender profesional", 45000, "Alimentación"],
  ["Torta/Pastel personalizado", "Torta temática de diseño exclusivo", 350000, "Alimentación"],
  ["Fotografía profesional", "Cobertura fotográfica completa del evento (8 hrs)", 1200000, "Multimedia"],
  ["Video profesional", "Grabación y edición de video del evento", 1800000, "Multimedia"],
  ["Drone", "Tomas aéreas con drone profesional", 500000, "Multimedia"],
  ["Cabina de fotos", "Photobooth con props e impresión instantánea", 600000, "Multimedia"],
  ["DJ profesional", "DJ con equipo de sonido profesional (6 hrs)", 800000, "Entretenimiento"],
  ["Banda en vivo", "Grupo musical en vivo (3 hrs)", 2500000, "Entretenimiento"],
  ["Animador/MC", "Maestro de ceremonias profesional", 500000, "Entretenimiento"],
  ["Show de fuegos artificiales", "Espectáculo pirotécnico de 5 minutos", 1500000, "Entretenimiento"],
  ["Arreglos florales", "Decoración floral personalizada", 800000, "Decoración"],
  ["Iluminación LED", "Iluminación ambiental con luces LED", 600000, "Decoración"],
  ["Mobiliario especial", "Alquiler de mobiliario lounge y decorativo", 900000, "Decoración"],
  ["Transporte invitados", "Bus de transporte para invitados (ida y vuelta)", 700000, "Logística"],
  ["Valet parking", "Servicio de parqueadero con valet", 400000, "Logística"],
];

for (const [name, description, price, category] of services) {
  await client.query(
    'INSERT INTO "Service" (name, description, price, category) VALUES ($1, $2, $3, $4)',
    [name, description, price, category]
  );
}

console.log("Seed completado exitosamente.");
console.log(`- ${packages.length} paquetes`);
console.log(`- ${services.length} servicios`);

await client.end();
