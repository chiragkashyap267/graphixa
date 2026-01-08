"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slider = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  order: number;
  active: boolean;
};

export default function SliderManager() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sliders/list")
      .then((res) => res.json())
      .then((data) => {
        setSliders(data);
        setLoading(false);
      });
  }, []);

  const deleteSlider = async (id: string) => {
    await fetch("/api/sliders/delete", {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ id }),
});

    setSliders((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <p>Loading sliders…</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Hero Slider</h2>

      <SliderUploadForm />

      <div className="space-y-4">
        {sliders.map((s) => (
          <div
            key={s.id}
            className="flex gap-4 items-center p-4 rounded-xl border border-white/10 bg-[#020617]"
          >
            <Image
              src={s.imageUrl}
              alt={s.title}
              width={160}
              height={90}
              className="rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-gray-400">{s.subtitle}</p>
              <p className="text-xs text-gray-500">Order: {s.order}</p>
            </div>

            <button
              onClick={() => deleteSlider(s.id)}
              className="text-red-400 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Upload Form ---------- */

function SliderUploadForm() {
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    await fetch("/api/sliders/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    window.location.reload();
  };

  return (
    <form
      onSubmit={submit}
      className="p-6 rounded-xl border border-white/10 bg-[#020617] space-y-4"
    >
      <h3 className="font-semibold">Add Slider</h3>

      <input type="file" name="file" required />
      <input name="title" placeholder="Title" required />
      <input name="subtitle" placeholder="Subtitle" required />
      <input name="order" type="number" placeholder="Order" required />

      <button
        disabled={loading}
        className="px-4 py-2 bg-teal-500 text-black rounded"
      >
        {loading ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
