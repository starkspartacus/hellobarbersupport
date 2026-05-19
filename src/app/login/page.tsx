"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";

const emailSchema = z
  .string()
  .email("Veuillez entrer une adresse email valide.");
const otpSchema = z
  .string()
  .min(6, "Le code OTP doit contenir au moins 6 caractères.");

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      emailSchema.parse(email);
      await axiosInstance.post("/auth/admin/request-otp", { email });
      setIsOtpStep(true);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Erreur lors de la demande du code.",
        );
      } else {
        setError("Erreur lors de la demande du code.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      otpSchema.parse(otp);

      const res = await signIn("credentials", {
        email,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setError(
          res.error === "CredentialsSignin"
            ? "Code invalide ou expiré."
            : res.error,
        );
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 sm:p-md antialiased text-on-surface relative">
      <main className="w-full max-w-[420px] bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm p-6 sm:p-xl flex flex-col items-center z-10 max-h-[85vh] overflow-y-auto">
        <header className="w-full flex flex-col items-center mb-6 sm:mb-lg">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-primary text-white flex items-center justify-center font-bold text-2xl sm:text-3xl mb-4 sm:mb-md">
            <span className="material-symbols-outlined text-[28px] sm:text-[32px]">
              support_agent
            </span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-headline-md text-on-surface text-center">
            Bienvenue
          </h1>
          <p className="font-body-sm text-sm sm:text-body-sm text-on-surface-variant text-center mt-2 sm:mt-xs">
            {isOtpStep
              ? "Entrez le code de vérification"
              : "Connectez-vous pour accéder à l'espace de support"}
          </p>
        </header>

        <form
          suppressHydrationWarning
          onSubmit={isOtpStep ? handleVerifyOtp : handleRequestOtp}
          className="w-full space-y-4 sm:space-y-md"
        >
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm sm:text-body-sm font-body-sm mb-4">
              {error}
            </div>
          )}

          {!isOtpStep ? (
            <div className="space-y-2 sm:space-y-xs">
              <label
                className="block font-label-md text-sm sm:text-label-md text-on-surface-variant"
                htmlFor="email"
              >
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[18px]">
                    mail
                  </span>
                </div>
                <input
                  suppressHydrationWarning
                  className="w-full pl-10 pr-3 py-2 sm:py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-sm sm:text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline-variant"
                  id="email"
                  name="email"
                  placeholder="agent@supportflow.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-xs">
              <label
                className="block font-label-md text-sm sm:text-label-md text-on-surface-variant"
                htmlFor="otp"
              >
                Code OTP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[18px]">
                    password
                  </span>
                </div>
                <input
                  suppressHydrationWarning
                  className="w-full pl-10 pr-3 py-2 sm:py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-sm sm:text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline-variant"
                  id="otp"
                  name="otp"
                  placeholder="123456"
                  required
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            suppressHydrationWarning
            className="w-full bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-sm sm:text-label-md py-2.5 sm:py-3 rounded-lg flex items-center justify-center transition-colors mt-6 sm:mt-lg disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? isOtpStep
                ? "Vérification..."
                : "Envoi en cours..."
              : isOtpStep
                ? "Se connecter"
                : "Recevoir le code"}
          </button>

          {isOtpStep && (
            <button
              type="button"
              onClick={() => {
                setIsOtpStep(false);
                setError("");
                setOtp("");
              }}
              className="w-full text-center text-primary font-label-sm text-sm sm:text-label-sm mt-4 hover:underline"
            >
              Retour
            </button>
          )}
        </form>
      </main>

      <footer className="absolute bottom-4 sm:bottom-8 w-full text-center z-0">
        <Link
          href="/confidentialite"
          className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Politique de confidentialité et gestion des données
        </Link>
      </footer>
    </div>
  );
}
