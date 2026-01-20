export function getRandomIntInclusive(min: number, max: number) {
  // Use Math.ceil to ensure the minimum is rounded up
  min = Math.ceil(min);
  // Use Math.floor to ensure the maximum is rounded down
  max = Math.floor(max);
  // The core formula:
  // Math.random() generates a number from 0 (inclusive) up to 1 (exclusive)
  // Multiplying by (max - min + 1) scales the range
  // Math.floor() rounds the result down to the nearest integer
  // Adding 'min' shifts the range to start from the correct minimum value
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomArrayItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random value from a TypeScript enum.
 * @param anEnum The enum object (e.g., MyEnum).
 * @returns A random value of the enum type.
 */
export function randomEnumValue<T extends object>(anEnum: T): T[keyof T] {
  // Get all string values of the enum (handles both numeric and string enums effectively)
  const enumValues = Object.values(anEnum);

  // Numeric enums have reverse mappings, so we need to filter them out.
  // We check if the first value can be parsed as a number.
  if (typeof enumValues[0] === 'number') {
    // If it's a numeric enum, filter out the numeric keys (the first half of the array)
    const numericKeys = enumValues.filter((value) => typeof value === 'string');
    const randomIndex = Math.floor(Math.random() * numericKeys.length);
    // Return the value corresponding to the random string key
    return anEnum[numericKeys[randomIndex] as keyof T];
  } else {
    // For string enums (or mixed enums after filtering), pick a random value directly
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }
}
const tribalPrefixes = ['kra', 'mor', 'rag', 'zul', 'tar', 'gor', 'vak', 'ruk', 'bal', 'tor'];

const tribalRoots = ['nak', 'dor', 'gar', 'muk', 'thar', 'zor', 'kan', 'bar', 'rak'];

const tribalSuffixes = ['an', 'uk', 'or', 'eth', 'ar', 'ok', 'ir'];

const tribeTitles = ['do Sangue', 'da Tempestade', 'da Presa', 'do Trovão'];

export function getTribeName() {
  const base =
    randomArrayItem(tribalPrefixes) +
    randomArrayItem(tribalRoots) +
    randomArrayItem(tribalSuffixes);

  let name = base;

  // 40% chance de título
  if (Math.random() < 0.1) {
    name += ` ${randomArrayItem(tribeTitles)}`;
  }

  return name
    .split(' ')
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(' ');
}

/**
 * Creates a random HEX code color
 * @returns {string} color hex code
 */
export const randomHexColor = (): string => {
  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomColor}`;
};
