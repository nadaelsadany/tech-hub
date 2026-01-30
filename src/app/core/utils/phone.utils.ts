/**
 * Normalize a phone number to E.164-like format
 * Strips non-digits (except leading +), adds default country code if missing
 */
export function normalizePhone(input: string, defaultCountry = '+20'): string {
    if (!input) return '';

    // Remove all non-digit characters except leading +
    let cleaned = input.replace(/[^\d+]/g, '');

    // If starts with +, keep it
    if (cleaned.startsWith('+')) {
        return cleaned;
    }

    // If starts with 00, convert to +
    if (cleaned.startsWith('00')) {
        return '+' + cleaned.slice(2);
    }

    // If starts with 0 (local), add default country code (removing the leading 0)
    if (cleaned.startsWith('0')) {
        return defaultCountry + cleaned.slice(1);
    }

    // Otherwise add default country code
    return defaultCountry + cleaned;
}

/**
 * Check if phone numbers match (normalized comparison)
 */
export function phoneMatch(a: string, b: string): boolean {
    const normA = normalizePhone(a);
    const normB = normalizePhone(b);
    if (!normA || !normB) return false;
    return normA === normB || normA.endsWith(normB.slice(-7)) || normB.endsWith(normA.slice(-7));
}

/**
 * Case-insensitive substring match for names
 */
export function nameMatch(text: string, query: string): boolean {
    if (!text || !query) return false;
    return text.toLowerCase().includes(query.toLowerCase());
}

/**
 * Format timestamp as relative time (e.g., "2h ago")
 */
export function formatRelative(ts: string | null | undefined): string {
    if (!ts) return '-';
    const diffMs = Date.now() - new Date(ts).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Date(ts).toLocaleDateString();
}

/**
 * Format phone for display (adds spaces for readability)
 */
export function formatPhone(phone: string): string {
    if (!phone) return '';
    // Simple format: +XX XXX XXX XXXX
    if (phone.startsWith('+')) {
        const nums = phone.slice(1);
        if (nums.length > 10) {
            return '+' + nums.slice(0, 2) + ' ' + nums.slice(2, 5) + ' ' + nums.slice(5, 8) + ' ' + nums.slice(8);
        }
    }
    return phone;
}
