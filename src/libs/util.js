export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function clsx(...inputs) {
  const classes = [];
  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(input);
    } else if (Array.isArray(input)) {
      classes.push(clsx(...input));
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(" ");
}

export function twMerge(...classLists) {
  let result = [];

  for (const classList of classLists) {
    if (!classList) continue;

    const classes =
      typeof classList === "string"
        ? classList.split(/\s+/)
        : Array.isArray(classList)
        ? classList
        : [];

    result = [...result, ...classes];
  }

  // Basic merge logic (for a complete solution, consider using a library like tailwind-merge)
  const uniqueClasses = [...new Set(result)];
  return uniqueClasses.join(" ");
}
