// src/utils/validateFileName.js

export function buildExpectedSlug(label) {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export function buildExpectedFileName(slug, startDate, endDate) {
  const fmt = (d) =>
    `${String(d.getDate()).padStart(2, "0")}_${String(d.getMonth() + 1).padStart(2, "0")}_${d.getFullYear()}`;
  return `${slug}_${fmt(startDate)}_${fmt(endDate)}`;
}

export function validateFileName(file, slug, startDate, endDate) {
  const expected = buildExpectedFileName(slug, startDate, endDate);
  // Strip extension
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  return nameWithoutExt === expected;
}