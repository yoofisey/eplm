export function CheckoutOverlay({
  title = "Preparing your gift…",
  body = "We are setting up your secure checkout. Do not close or refresh this tab.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div
      className="checkout-overlay fixed inset-0 z-[200] grid place-items-center bg-background/95 p-6 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex max-w-sm flex-col items-center text-center">
        <span className="spinner" aria-hidden="true" />
        <p className="mt-6 font-display text-2xl text-ink dark:text-parchment">
          {title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-parchment/70">
          {body}
        </p>
      </div>
    </div>
  );
}