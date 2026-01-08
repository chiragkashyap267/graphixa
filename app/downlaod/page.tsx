"use client";

import { useSearchParams } from "next/navigation";

export default function DownloadPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  if (!orderId) return <p>Missing order reference.</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Your download is ready</h1>
      <p className="mb-6">
        Click below to download. The link expires automatically.
      </p>

      <a
        href={`/api/download?orderId=${orderId}`}
        className="bg-black text-white px-6 py-3 rounded inline-block"
      >
        Download Files
      </a>
    </div>
  );
}
