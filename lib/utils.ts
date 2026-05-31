export function formatPrice(amount: number | string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(amount)
  );
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}
