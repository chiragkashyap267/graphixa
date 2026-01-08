"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Image from "next/image";

type PurchasedItem = {
  id: string;
  title: string;
  price: number;
  previewUrl: string;
  purchasedAt: number;
};

export default function AccountPage() {
  const user = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [purchases, setPurchases] = useState<PurchasedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Protect page
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  // 📦 Fetch profile + purchases
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Profile
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          setProfile(userSnap.data());
        }

        // Purchases (SOURCE OF TRUTH)
        const purchasesSnap = await getDocs(
          collection(db, "users", user.uid, "purchases")
        );

        const items: PurchasedItem[] = [];

        for (const purchase of purchasesSnap.docs) {
          const purchaseData = purchase.data();

          const productSnap = await getDoc(
            doc(db, "products", purchase.id)
          );

          if (!productSnap.exists()) continue;

          const product = productSnap.data();

          items.push({
            id: purchase.id,
            title: product.title,
            price: product.price,
            previewUrl: product.previewUrl,
            purchasedAt: purchaseData.purchasedAt,
          });
        }

        setPurchases(items);
      } catch (err) {
        console.error("Failed to load purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-300">
        Loading account…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-14">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* 👤 PROFILE */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <PersonIcon className="text-teal-400" />
            <h1 className="text-2xl font-bold">My Account</h1>
          </div>

          <div className="space-y-2 text-slate-300">
            <p>
              <span className="text-slate-400">Email:</span>{" "}
              {user.email}
            </p>

            {profile?.name && (
              <p>
                <span className="text-slate-400">Name:</span>{" "}
                {profile.name}
              </p>
            )}

            {profile?.phone && (
              <p>
                <span className="text-slate-400">Mobile:</span>{" "}
                {profile.phone}
              </p>
            )}
          </div>
        </div>

        {/* 🧾 PURCHASED ASSETS */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <ReceiptLongIcon className="text-teal-400" />
            <h2 className="text-xl font-semibold">
              My Purchased Assets
            </h2>
          </div>

          {purchases.length === 0 ? (
            <p className="text-slate-400">
              You haven’t purchased any assets yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {purchases.map((item) => (
                <div
                  key={item.id}
                  className="
                    rounded-xl
                    bg-black/40
                    border border-white/10
                    p-3
                  "
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                    <Image
                      src={item.previewUrl}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <h3 className="text-sm font-medium line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>₹{item.price}</span>
                    <span>
                      {new Date(item.purchasedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-2 text-center text-teal-400 text-xs font-semibold">
                    Purchased ✔
                  </div>
                  <button
  onClick={async () => {
    const user = await import("firebase/auth").then(m => m.getAuth().currentUser);
    if (!user) return;

    const token = await user.getIdToken();
    window.location.href = `/api/download/${item.id}?token=${token}`
;
  }}
  className="
    mt-3
    w-full
    py-2.5
    rounded-xl
    bg-teal-400
    text-black
    font-semibold
    hover:bg-teal-300
    transition
  "
>
  Download Asset
</button>


                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
