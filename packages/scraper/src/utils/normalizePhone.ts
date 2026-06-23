/**
 * Normalizes a Malaysian phone number string to a standard 60123456789 format.
 * 
 * Rules:
 * - Remove all non-numeric characters (spaces, dashes, plus signs, brackets)
 * - If it starts with '0', replace '0' with '60'
 * - If it starts with '1' (e.g. 123456789), prepend '60'
 * - If it already starts with '60', leave it
 * 
 * @param phone Raw phone string (e.g. "+60 12-345 6789", "0123456789")
 * @returns Clean normalized string
 */
export function normalizePhone(phone: string): string {
    // Remove non-numeric characters
    let digits = phone.replace(/\D/g, "");

    // Convert basic formats to standard international format (without +)
    if (digits.startsWith("0")) {
        digits = "6" + digits; // 012... -> 6012...
    } else if (digits.startsWith("1")) {
        digits = "60" + digits; // 12... -> 6012...
    }

    // Handle some edge cases where country code 60 is omitted but string starts with another valid digit
    // Mostly Malaysian mobile numbers start with 01, meaning length is ~10-11.
    // After prepending 6, standard is ~11-12 digits.

    return digits;
}

/**
 * Checks if a normalized phone number is a Malaysian mobile number.
 * Malaysian mobile numbers start with 601 and are typically 11 to 12 digits long.
 */
export function isMobilePhone(normalizedPhone: string): boolean {
    if (!normalizedPhone) return false;
    return normalizedPhone.startsWith("601") && normalizedPhone.length >= 11 && normalizedPhone.length <= 12;
}
