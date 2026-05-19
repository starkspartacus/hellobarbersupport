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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-surface-variant/30 px-4 sm:px-6 relative overflow-hidden">
      {/* Éléments de décoration en arrière-plan */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-error/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="w-full max-w-md bg-surface/80 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] shadow-xl border border-white/20 z-10 animate-fade-in-up transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center animate-bounce-slow">
            <span className="material-symbols-outlined text-3xl">
              person_remove
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-display-sm font-bold mb-3 text-center text-on-surface tracking-tight">
          Suppression de compte
        </h1>
        <p className="text-sm sm:text-body-md text-on-surface-variant mb-8 text-center leading-relaxed">
          Renseignez votre adresse email associée à votre compte pour demander
          la suppression de toutes vos données personnelles.
        </p>

        {message && (
          <div
            className={`p-4 mb-6 rounded-2xl text-sm sm:text-body-md font-medium flex items-start gap-3 animate-fade-in ${
              message.type === "success"
                ? "bg-primary-container/50 text-on-primary-container border border-primary-container"
                : "bg-error-container/50 text-on-error-container border border-error-container"
            }`}
          >
            <span className="material-symbols-outlined shrink-0">
              {message.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col gap-2 group">
            <label
              htmlFor="email"
              className="text-sm sm:text-label-lg font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors"
            >
              Adresse email <span className="text-error">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors">
                  mail
                </span>
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-surface/50 text-body-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 hover:border-outline-variant placeholder:text-outline-variant"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 group">
            <label
              htmlFor="reason"
              className="text-sm sm:text-label-lg font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors"
            >
              Raison de la suppression{" "}
              <span className="text-outline font-normal">(optionnel)</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Dites-nous pourquoi vous souhaitez nous quitter..."
              rows={3}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-surface/50 text-body-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 hover:border-outline-variant resize-none placeholder:text-outline-variant"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-base sm:text-label-lg transition-all duration-300 flex items-center justify-center gap-2 mt-2 ${
              loading
                ? "bg-surface-variant text-on-surface-variant cursor-not-allowed"
                : "bg-error text-on-error hover:bg-error/90 hover:shadow-lg hover:shadow-error/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">
                  progress_activity
                </span>
                Envoi en cours...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">
                  delete_forever
                </span>
                Demander la suppression
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
      <footer
        className="absolute bottom-4 sm:bottom-8 w-full flex flex-col items-center gap-2 z-0 animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
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
