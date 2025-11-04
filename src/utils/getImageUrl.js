export function getImageUrl(path) {
  // Tilføjer automatisk korrekt base-path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}