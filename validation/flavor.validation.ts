import { z } from 'zod';

// Reusable field validators
const nameValidator = (fieldName: string) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(1, `${fieldName} is required`)
    .min(2, `${fieldName} must be at least 2 characters`)
    .max(100, `${fieldName} must not exceed 100 characters`)
    .trim();

// Color validator supporting multiple formats
const colorValidator = z
  .string()
  .min(1, 'Color is required')
  .refine(
    (color) => {
      // Hex colors: #RGB, #RRGGBB, #RRGGBBAA
      if (/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(color)) {
        return true;
      }

      // RGB colors: rgb(r, g, b)
      if (/^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(color)) {
        const matches = color.match(/\d+/g);
        if (matches && matches.length === 3) {
          return matches.every(num => parseInt(num) >= 0 && parseInt(num) <= 255);
        }
      }

      // RGBA colors: rgba(r, g, b, a)
      if (/^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(color)) {
        const matches = color.match(/[\d.]+/g);
        if (matches && matches.length === 4) {
          const [r, g, b, a] = matches.map(Number);
          return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1;
        }
      }

      // HSL colors: hsl(h, s%, l%)
      if (/^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/.test(color)) {
        const matches = color.match(/\d+/g);
        if (matches && matches.length === 3) {
          const [h, s, l] = matches.map(Number);
          return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
        }
      }

      // HSLA colors: hsla(h, s%, l%, a)
      if (/^hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(color)) {
        const matches = color.match(/[\d.%]+/g);
        if (matches && matches.length === 4) {
          const hMatch = matches[0].match(/\d+/);
          const sMatch = matches[1].match(/\d+/);
          const lMatch = matches[2].match(/\d+/);
          const aMatch = matches[3].match(/(0|1|0?\.\d+)/);

          if (hMatch && sMatch && lMatch && aMatch) {
            const h = parseInt(hMatch[0]);
            const s = parseInt(sMatch[0]);
            const l = parseInt(lMatch[0]);
            const a = parseFloat(aMatch[0]);
            return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100 && a >= 0 && a <= 1;
          }
        }
      }

      // Named colors (basic check - just ensure it's a word)
      if (/^[a-zA-Z]+$/.test(color)) {
        return true;
      }

      return false;
    },
    {
      message: 'Color must be a valid format: hex (#FF0000), rgb(255,0,0), rgba(255,0,0,1), hsl(0,100%,50%), hsla(0,100%,50%,1), or named color (red)',
    }
  );

const descriptionValidator = z
  .string()
  .min(1, 'Description is required')
  .max(500, 'Description must not exceed 500 characters');

// Flavor Management Validation Schemas
export const createFlavorSchema = z.object({
  name: nameValidator('Name'),
  color: colorValidator,
  description: descriptionValidator,
  isActive: z.boolean(),
});

export const updateFlavorSchema = z.object({
  name: nameValidator('Name').optional(),
  color: colorValidator.optional(),
  description: descriptionValidator.optional(),
  isActive: z.boolean().optional(),
});

export const flavorFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  name: z.string().optional(),
  color: z.string().optional(),
  isActive: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});
