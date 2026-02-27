/**
 * WB присылает числа строками, иногда с запятой и пробелами, иногда "-" вместо числа.
 * Возвращаем string пригодную для вставки в Postgres, либо null.
 */
export function parseWbNumeric(value: unknown): string | null {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value !== "string") {
        if (typeof value === "number" && Number.isFinite(value)) {
            return String(value);
        }

        return null;
    }

    const raw = value.trim();

    if (!raw || raw === "-") {
        return null;
    }

    const normalized = raw.replace(/\s+/g, "").replace(",", ".");

    if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
        return null;
    }

    return normalized;
}

export function emptyToNull(value: unknown): string | null {
    if (typeof value !== "string") {
        return null;
    }

    const v = value.trim();

    return v ? v : null;
}
