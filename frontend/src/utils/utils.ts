export function toggleVisibility(setIsVisible: (value: (prev: boolean) => boolean) => void) {
  setIsVisible((prev: boolean) => !prev);
}

export function validateEmail(value: string): boolean {
  if (!value) return true;
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
}
