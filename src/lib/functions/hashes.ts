import { createHash } from "crypto";

export const hashSHA256 = (data: string): string => {
  // Crea el hash usando SHA-256
  const hash = createHash("sha256");
  hash.update(data); // Agrega los datos al hash
  return hash.digest("hex"); // Devuelve el hash en formato hexadecimal
};
