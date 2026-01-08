export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300">
      <h1 className="text-3xl font-bold text-white mb-6">
        Refund Policy
      </h1>

      <p className="mb-4">
        GraphiXA sells digital products. Due to the nature of digital goods,
        refunds are limited.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-2">
        Refund Eligibility
      </h2>
      <p className="mb-4">
        Refunds may be considered if the product is defective or does not match
        its description.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-2">
        Requesting a Refund
      </h2>
      <p className="mb-4">
        Please contact us within 7 days of purchase with your order details.
      </p>

      <p className="mt-8">
        Email us at{" "}
        <span className="text-teal-400">support@graphixa.com</span>.
      </p>
    </div>
  );
}
