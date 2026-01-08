"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-[0_20px_60px_-15px_rgba(45,212,191,0.35)]">
        <div className="flex justify-center mb-4 text-teal-400">
          <LoginIcon fontSize="large" />
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h1>

        <input
          placeholder="Email"
          type="email"
          className="
            w-full mb-3 px-4 py-2 rounded-lg
            bg-black/40 text-white
            border border-white/10
            focus:outline-none focus:ring-2 focus:ring-teal-400
            placeholder:text-slate-400
          "
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="
            w-full mb-5 px-4 py-2 rounded-lg
            bg-black/40 text-white
            border border-white/10
            focus:outline-none focus:ring-2 focus:ring-teal-400
            placeholder:text-slate-400
          "
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          onClick={login}
          sx={{
            backgroundColor: "#2dd4bf",
            color: "#020617",
            fontWeight: 600,
            paddingY: 1.2,
            borderRadius: "0.6rem",
            "&:hover": {
              backgroundColor: "#5eead4",
            },
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
