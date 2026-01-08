"use client";

import { Suspense } from "react";
import DownloadClient from "./DownloadClient";

export default function DownloadPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading download…</p>}>
      <DownloadClient />
    </Suspense>
  );
}
