// Lightweight async confirm helper. If window.confirm is unavailable (SSR), always resolve false.
export const confirm = async (title, message) => {
  if (typeof window === "undefined" || !window.confirm) return false;
  return window.confirm(`${title}\n\n${message}`);
};

export default confirm;
