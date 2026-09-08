import {
  loadProductionEnvironment,
  validateProductionUrl,
} from "./lib/production-env-validator.mjs";

const REQUIRED_URLS = ["VITE_API_URL", "VITE_AUTH_APP_URL", "VITE_MESA_AYUDA_API_URL"];

const OPTIONAL_URLS = ["VITE_MESA_AYUDA_API_PROXY_TARGET", "VITE_FORMATO_NNA_PUBLIC_URL"];

console.log("");
console.log("======================================================");
console.log(" MESA DE AYUDA - VALIDACION DE ENTORNO PRODUCCION");
console.log("======================================================");

const { environment, loadedFiles } = loadProductionEnvironment(process.cwd());
const issues = [];

for (const variableName of REQUIRED_URLS) {
  issues.push(...validateProductionUrl(variableName, environment[variableName]));
}

for (const variableName of OPTIONAL_URLS) {
  issues.push(
    ...validateProductionUrl(variableName, environment[variableName], {
      required: false,
    }),
  );
}

console.log("");
console.log(
  loadedFiles.length
    ? `Archivos de entorno detectados: ${loadedFiles.join(", ")}`
    : "Archivos de entorno detectados: ninguno; se validará process.env.",
);

if (issues.length) {
  console.error("");
  console.error("FAIL: configuración de producción inválida.");
  for (const issue of issues) {
    console.error(`- ${issue.variable}: ${issue.message}`);
  }
  console.error("");
  console.error("No se generó build.");
  process.exit(1);
}

console.log("");
console.log("PASS: Mesa de Ayuda lista para build de producción.");
console.log("PASS: Auth, Login Access y API Mesa configurados sin localhost.");
