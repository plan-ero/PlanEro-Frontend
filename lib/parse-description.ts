/**
 * Parse description and return formatted HTML
 * Handles both JSON structured data and plain text
 *
 * @param description - JSON string or plain text description
 * @returns Formatted HTML string
 */
export function parseDescription(
  description: string | null | undefined,
): string {
  if (!description || description.trim() === "") {
    return "";
  }

  try {
    // Try to parse as JSON
    const parsed = JSON.parse(description);

    // Check if it's an array (list of items)
    if (Array.isArray(parsed)) {
      return `<ul class="list-disc pl-6 space-y-2">${parsed.map((item) => `<li>${escapeHtml(String(item))}</li>`).join("")}</ul>`;
    }

    // Check if it's an object with structured data
    if (typeof parsed === "object" && parsed !== null) {
      let html = "";

      for (const [key, value] of Object.entries(parsed)) {
        if (Array.isArray(value)) {
          html += `<div class="mb-4"><strong class="block mb-2">${escapeHtml(formatKey(key))}:</strong><ul class="list-disc pl-6 space-y-1">${value.map((item) => `<li>${escapeHtml(String(item))}</li>`).join("")}</ul></div>`;
        } else if (typeof value === "object" && value !== null) {
          html += `<div class="mb-4"><strong class="block mb-2">${escapeHtml(formatKey(key))}:</strong>${parseDescription(JSON.stringify(value))}</div>`;
        } else {
          html += `<p class="mb-2"><strong>${escapeHtml(formatKey(key))}:</strong> ${escapeHtml(String(value))}</p>`;
        }
      }

      return html;
    }

    // If it's a primitive value after JSON parsing
    return `<p>${escapeHtml(String(parsed))}</p>`;
  } catch {
    // Not valid JSON, treat as plain text
    // Split by newlines and wrap each paragraph
    const paragraphs = description
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (paragraphs.length === 0) {
      return "";
    }

    if (paragraphs.length === 1) {
      return `<p>${escapeHtml(paragraphs[0])}</p>`;
    }

    return paragraphs
      .map((para) => `<p class="mb-3">${escapeHtml(para)}</p>`)
      .join("");
  }
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format object keys to human-readable labels
 */
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
}
