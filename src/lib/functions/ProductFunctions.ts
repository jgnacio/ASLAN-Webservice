import { ProductType } from "@/domain/product/entities/Product";
import { AslanWooAPIProduct } from "@/Resources/API/ASLAN/entities/AslanWooAPIProduct";
import { UnicomAPIProduct } from "@/Resources/API/Unicom/entities/Product/UnicomAPIProduct";

export const extractPartNumber = (description: string) => {
  // Expresión regular para encontrar el part number en texto plano o en HTML
  const regex = /Part Number\s*[^:]*:\s*([\w\-./# ]+)\b/i;
  const match = description.match(regex);
  if (match) {
    return match[1].trim(); // El primer grupo de captura contiene el part number y se elimina cualquier espacio extra
  }

  return null; // No se encontró ningún part number
};

export const isTheSameProductAslanUnicom = (
  productA: AslanWooAPIProduct,
  productB: ProductType
) => {
  // Compara los part numbers de los productos
  if (productA.description && productB.partNumber) {
    return (
      productB.partNumber[0].partNumber ===
      extractPartNumber(productA.description)
    );
  }
};

interface SimilarityResult extends ProductType {
  similarityScore: number;
  matchType: "exact" | "high" | "moderate" | "low";
  matchReasons: string[];
}

// Utility functions
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const calculateLevenshteinDistance = (str1: string, str2: string): number => {
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[str1.length][str2.length];
};

const calculateProductSimilarity = (
  product1: ProductType,
  product2: ProductType
): { score: number; reasons: string[] } => {
  const reasons: string[] = [];
  let totalScore = 0;
  let weightSum = 0;

  // Title similarity (weight: 0.3)
  const titleWeight = 0.3;
  const normalizedTitle1 = normalizeText(product1.title);
  const normalizedTitle2 = normalizeText(product2.title);
  const titleWords1 = normalizedTitle1.split(" ");
  const titleWords2 = normalizedTitle2.split(" ");

  const commonWords = titleWords1.filter((word) =>
    titleWords2.some((w2) => calculateLevenshteinDistance(word, w2) <= 1)
  );
  const titleScore =
    (commonWords.length * 2) / (titleWords1.length + titleWords2.length);
  totalScore += titleScore * titleWeight;
  weightSum += titleWeight;

  if (titleScore > 0.7) {
    reasons.push("Título similar");
  }

  // Brand match (weight: 0.2)
  const brandWeight = 0.2;
  const brandScore =
    normalizeText(product1.marca) === normalizeText(product2.marca) ? 1 : 0;
  totalScore += brandScore * brandWeight;
  weightSum += brandWeight;

  if (brandScore === 1) {
    reasons.push("Misma marca");
  }

  // Category match (weight: 0.15)
  const categoryWeight = 0.15;
  const categoryScore = product1.category === product2.category ? 1 : 0;
  totalScore += categoryScore * categoryWeight;
  weightSum += categoryWeight;

  if (categoryScore === 1) {
    reasons.push("Misma categoría");
  }

  // Part number similarity (weight: 0.2)
  const partNumberWeight = 0.2;
  let partNumberScore = 0;

  if (product1.partNumber && product2.partNumber) {
    const partNumbers1 = product1.partNumber as any;
    const partNumbers2 = product2.partNumber[0].partNumber as string;
    const hasCommonPartNumber =
      partNumbers1 === partNumbers2 ||
      calculateLevenshteinDistance(partNumbers1, partNumbers2) <= 1;
    partNumberScore = hasCommonPartNumber ? 1 : 0;
    if (hasCommonPartNumber) {
      reasons.push("Número de parte coincidente");
    }
  }

  totalScore += partNumberScore * partNumberWeight;
  weightSum += partNumberWeight;

  // Price similarity (weight: 0.15)
  const priceWeight = 0.15;
  const priceDifference = Math.abs(product1.price - product2.price);
  const priceScore = priceDifference < product1.price * 0.2 ? 1 : 0; // 20% tolerance
  totalScore += priceScore * priceWeight;
  weightSum += priceWeight;

  if (priceScore === 1) {
    reasons.push("Precio similar");
  }

  const finalScore = totalScore / weightSum;

  return { score: finalScore, reasons };
};

export const findSimilarProducts = async (
  productState: ProductType,
  server_getCachedProducts: () => Promise<ProductType[]>
): Promise<{
  identifiedProducts: SimilarityResult[];
  similarProducts: SimilarityResult[];
}> => {
  const cachedProducts = await server_getCachedProducts();
  const allProductsList = cachedProducts || [];

  const similarProducts: SimilarityResult[] = [];
  const identifiedProducts: SimilarityResult[] = [];

  // Create a Map for faster SKU lookups
  const processedSkus = new Set<string>();

  for (const product of allProductsList) {
    // Skip if it's exactly the same product
    if (product.id === productState.id) {
      continue;
    }

    // Skip if we've already processed this SKU
    if (processedSkus.has(product.sku)) {
      continue;
    }
    processedSkus.add(product.sku);

    // Calculate similarity
    const { score, reasons } = calculateProductSimilarity(
      product,
      productState
    );

    const similarityResult: SimilarityResult = {
      ...product,
      similarityScore: score,
      matchType:
        score > 0.8
          ? "exact"
          : score > 0.6
          ? "high"
          : score > 0.4
          ? "moderate"
          : "low",
      matchReasons: reasons,
    };

    // Exact SKU match
    if (product.sku === productState.sku) {
      identifiedProducts.push(similarityResult);
      continue;
    }

    // Add to similar products if similarity is high enough
    if (score > 0.4) {
      similarProducts.push(similarityResult);
    }
  }

  // Sort products by similarity score
  const sortBySimilarity = (a: SimilarityResult, b: SimilarityResult) =>
    b.similarityScore - a.similarityScore;

  similarProducts.sort(sortBySimilarity);
  identifiedProducts.sort(sortBySimilarity);

  return {
    identifiedProducts,
    similarProducts: similarProducts.slice(0, 10), // Limit to top 10 most similar
  };
};
