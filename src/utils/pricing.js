/**
 * Unified Pricing Engine for Quest Travel Planner
 * Dynamic price calculation based on:
 * - Number of Days & Nights
 * - Number of Guests / Members
 * - Travel Vibe / Category
 * - Single Unified INR (₹) Currency
 */

export const VIBE_MULTIPLIERS = {
  'Luxury': 1.5,
  'Romance': 1.4,
  'Couples': 1.3,
  'Heritage': 1.25,
  'Adventure': 1.2,
  'Family': 1.1,
  'Culture & History': 1.25,
  'Relaxation & Nature': 1.15,
  'Solo': 0.85,
  'Budget': 0.8,
  'All Place': 1.0,
  'Default': 1.0
};

/**
 * Calculates dynamic total price based on base rate, nights, guests, and travel vibe.
 * @param {number} baseNightlyRate - Per night per guest base rate in INR
 * @param {number} nights - Total number of nights
 * @param {number} guests - Total number of guests / members
 * @param {string} vibe - Travel vibe or category (e.g. Luxury, Couples, Family)
 * @returns {{ total: number, vibeMultiplier: number, perNightPerGuest: number }}
 */
export function calculateDynamicPrice(baseNightlyRate = 2200, nights = 4, guests = 2, vibe = 'Default') {
  const numNights = Math.max(1, Number(nights) || 4);
  const numGuests = Math.max(1, Number(guests) || 2);
  const baseRate = Math.max(40, Number(baseNightlyRate) || 2200);

  const multiplierKey = Object.keys(VIBE_MULTIPLIERS).find(k => 
    vibe && vibe.toLowerCase().includes(k.toLowerCase())
  ) || 'Default';

  const vibeMultiplier = VIBE_MULTIPLIERS[multiplierKey] || 1.0;

  const total = Math.round(baseRate * numNights * numGuests * vibeMultiplier);

  return {
    total,
    vibeMultiplier,
    perNightPerGuest: baseRate,
    nights: numNights,
    guests: numGuests
  };
}

/**
 * Formats a number to a unified INR currency string: e.g. "₹12,400 INR" or "₹12,400"
 * @param {number} amount
 * @param {boolean} includeSuffix
 * @returns {string}
 */
export function formatCurrency(amount, includeSuffix = false) {
  const num = Math.round(Number(amount) || 0);
  const formatted = `₹${num.toLocaleString('en-IN')}`;
  return includeSuffix ? `${formatted} INR` : formatted;
}
