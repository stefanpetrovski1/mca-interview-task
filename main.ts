const API_URL = 'https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1';

interface Product {
  name: string;
  domestic: boolean;
  price: number;
  weight?: number; // weight could be N/A
  description: string;
}

async function fetchData(url: string): Promise<Product[]> {
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error('Error fetching data');
  }
  const data = (await response.json()) as Product[];
  return data;
}

function filterProducts(products: Product[], isDomestic: boolean): Product[] {
  const predicate = (product: Product) => product.domestic === isDomestic;

  return products.filter(predicate);
}

function sortProductsAlphabetically(products: Product[]): void {
  products.sort((leftProduct: Product, rightProduct: Product) => {
    const leftProductName = leftProduct.name.toLowerCase();
    const rightProductName = rightProduct.name.toLowerCase();

    if (leftProductName === rightProductName) {
      return 0;
    }

    return leftProductName < rightProductName ? -1 : 1;
  });
}

function calculateTotalCost(products: Product[]): number {
  return products.map((product) => product.price).reduce((total, curr) => total + curr, 0);
}

function printProductsInFormat(products: Product[]) {
  sortProductsAlphabetically(products);
  const indent = ' '.repeat(3);
  const dots = '.'.repeat(3);
  products.forEach((product) => {
    const productWeightLabel: string =
      product.weight !== undefined ? `${product.weight}g` : 'N/A';

    console.log(`${dots} ${product.name}`);
    console.log(`${indent} Price: $${transformNumberInFormat(product.price)}`);
    console.log(`${indent} ${product.description.substring(0, 10)}${dots}`);
    console.log(`${indent} Weight: ${productWeightLabel}`);
  });
}

function replaceDotWithComma(number: string): string {
  return number.split('.').join(',');
}

function transformNumberInFormat(number: number): string {
  const numberFixed = number % 1 === 0 ? `${number}.0` : number.toFixed(1);
  return replaceDotWithComma(numberFixed);
}

async function main() {
  try {
    const products = await fetchData(API_URL);

    // Domestic products:
    console.log('. Domestic');
    const domesticProducts = filterProducts(products, true);
    printProductsInFormat(domesticProducts);

    // Imported products:
    console.log('. Imported');
    const importedProducts = filterProducts(products, false);
    printProductsInFormat(importedProducts);

    // Total cost per group
    const domesticProductsTotalCost = calculateTotalCost(domesticProducts);
    const importedProductsTotalCost = calculateTotalCost(importedProducts);
    const domesticProductsTotalCostString = transformNumberInFormat(domesticProductsTotalCost);
    const importedProductsTotalCostString = transformNumberInFormat(importedProductsTotalCost);

    console.log(`Domestic cost: $${domesticProductsTotalCostString}`);
    console.log(`Imported cost: $${importedProductsTotalCostString}`);

    // Total purchased products per group:
    console.log(`Domestic count: ${domesticProducts.length}`);
    console.log(`Imported count: ${importedProducts.length}`);
  } catch (error) {
    console.log(error);
  }
}

main();
