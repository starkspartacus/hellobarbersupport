"use client";

import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await axiosInstance.post("/account-deletion/request", {
        email,
        reason,
      });
      setMessage({
        text: "Votre demande de suppression de compte a bien été envoyée. Elle sera traitée dans les plus brefs délais.",
        type: "success",
      });
      setEmail("");
      setReason("");
    } catch (error: unknown) {
      console.error(error);
      setMessage({
        text: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer plus tard.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative">
      <div className="w-full max-w-md bg-surface p-8 rounded-3xl shadow-sm border border-outline-variant z-10">
        <h1 className="text-display-sm font-semibold mb-2 text-center">
          Suppression de compte
        </h1>
        <p className="text-body-md text-on-surface-variant mb-8 text-center">
          Renseignez votre adresse email associée à votre compte pour demander
          la suppression de toutes vos données personnelles.
        </p>

        {message && (
          <div
            className={`p-4 mb-6 rounded-xl text-body-md ${
              message.type === "success"
                ? "bg-primary-container text-on-primary-container"
                : "bg-error-container text-on-error-container"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-label-lg font-medium text-on-surface"
            >
              Adresse email *
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              className="px-4 py-3 rounded-xl border border-outline-variant bg-surface text-body-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="reason"
              className="text-label-lg font-medium text-on-surface"
            >
              Raison de la suppression (optionnel)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Dites-nous pourquoi vous souhaitez supprimer votre compte..."
              rows={4}
              className="px-4 py-3 rounded-xl border border-outline-variant bg-surface text-body-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-full font-medium text-label-lg transition-all ${
              loading
                ? "bg-surface-variant text-on-surface-variant cursor-not-allowed"
                : "bg-error text-on-error hover:opacity-90 active:scale-[0.98]"
            }`}
          >
            {loading ? "Envoi en cours..." : "Demander la suppression"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-body-sm text-primary hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-4 sm:bottom-8 w-full flex flex-col items-center gap-2 z-0">
        <Link
          href="/privacy"
          className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Politique de confidentialité et gestion des données
        </Link>
      </footer>
    </div>
  );
}
