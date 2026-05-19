import Link from "next/link";

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-surface-variant/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Éléments de décoration en arrière-plan */}
      <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-4xl mx-auto bg-surface/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden z-10 animate-fade-in-up">
        <div className="bg-primary px-8 py-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-symbols-outlined text-[120px]">
              policy
            </span>
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4 leading-tight">
              Politique de Confidentialité <br />
              <span className="text-primary-container">
                & Gestion des Données
              </span>
            </h1>
            <div className="flex items-center gap-2 text-primary-container/90 font-medium">
              <span className="material-symbols-outlined text-sm">update</span>
              Dernière mise à jour : {currentDate}
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-12 py-12 text-gray-700 space-y-16">
          <section
            className="animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="p-6 sm:p-8 bg-primary/5 rounded-[2rem] border border-primary/10 relative group">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">info</span>
              </div>
              <p className="text-lg leading-relaxed text-on-surface-variant font-medium">
                Bienvenue sur <strong className="text-primary">Koup</strong>{" "}
                (ci-après &quot;l&apos;Application&quot;). La présente Politique
                de Confidentialité a pour but de vous informer de manière
                transparente sur la manière dont nous collectons, utilisons,
                partageons et protégeons vos données personnelles lorsque vous
                utilisez notre Application.
              </p>
              <div className="mt-6 flex items-start gap-3 p-4 bg-white/50 rounded-xl border border-primary/10 text-sm text-primary italic">
                <span className="material-symbols-outlined text-primary shrink-0">
                  verified_user
                </span>
                En créant un compte et en utilisant Koup, vous acceptez
                expressément et sans réserve les termes de la présente Politique
                de Confidentialité.
              </div>
            </div>
          </section>

          <section
            className="animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                1
              </div>
              DONNÉES COLLECTÉES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  icon: "badge",
                  title: "Identification",
                  text: "Nom, prénom, email, téléphone, SIRET pour les pros.",
                },
                {
                  icon: "location_on",
                  title: "Géolocalisation",
                  text: "Position précise (GPS) pour le matchmaking et offres ciblées.",
                },
                {
                  icon: "mic",
                  title: "Données Vocales",
                  text: "Requêtes vocales analysées pour notre Voice Bot et IA.",
                },
                {
                  icon: "payments",
                  title: "Transactions",
                  text: "Historique et prix. Paiements sécurisés via Stripe.",
                },
                {
                  icon: "smartphone",
                  title: "Appareil",
                  text: "IP, modèle, OS et interactions avec l'interface.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-3xl border border-outline-variant/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-on-surface mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                2
              </div>
              UTILISATION (FINALITÉS)
            </h2>

            <div className="space-y-6">
              {[
                {
                  id: "A",
                  title: "Fourniture du service",
                  subtitle: "Exécution du contrat",
                  items: [
                    "Gestion de compte",
                    "Algorithme de Matchmaking",
                    "Traitements des paiements",
                    "Notifications de rendez-vous",
                  ],
                  color: "bg-primary",
                },
                {
                  id: "B",
                  title: "Amélioration",
                  subtitle: "Intérêt légitime",
                  items: [
                    "Perfectionnement de l'IA",
                    "Analyse UX/UI & Bugs",
                    "Statistiques de consommation",
                  ],
                  color: "bg-secondary",
                },
                {
                  id: "C",
                  title: "Commercial & Publicité",
                  subtitle: "Avec consentement",
                  items: [
                    "Monétisation et Partenariats",
                    "Ciblage Publicitaire",
                    "Reciblage (Meta, Google Ads)",
                  ],
                  color: "bg-tertiary",
                },
              ].map((section, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden bg-white rounded-[2rem] border border-outline-variant/50 p-6 sm:p-8 hover:shadow-lg transition-shadow"
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 ${section.color} opacity-5 rounded-full -mr-16 -mt-16`}
                  ></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">
                        {section.id}. {section.title}
                      </h3>
                      <span className="text-xs font-bold uppercase tracking-widest text-outline">
                        {section.subtitle}
                      </span>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-3 text-sm text-on-surface-variant bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${section.color}`}
                        ></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section
            className="animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                3
              </div>
              PARTAGE DES DONNÉES
            </h2>
            <div className="bg-white rounded-[2rem] border border-outline-variant/50 divide-y divide-outline-variant/30 overflow-hidden">
              {[
                {
                  title: "Utilisateurs",
                  text: "Partage entre client et professionnel pour la prestation.",
                },
                {
                  title: "Sous-traitants",
                  text: "AWS, Google Cloud, Stripe, Firebase, Google Analytics.",
                },
                {
                  title: "Partenaires",
                  text: "Opérations marketing conjointes (cf section 2.C).",
                },
                {
                  title: "Autorités",
                  text: "Divulgation légale si obligatoire pour la sécurité.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 flex items-start gap-4 hover:bg-surface-container-lowest transition-colors"
                >
                  <span className="material-symbols-outlined text-primary mt-1">
                    share
                  </span>
                  <div>
                    <h4 className="font-bold text-on-surface">{item.title}</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            className="animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                4
              </div>
              CONSERVATION & SÉCURITÉ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                <h3 className="flex items-center gap-3 font-bold text-primary mb-4">
                  <span className="material-symbols-outlined">history</span>
                  Durées
                </h3>
                <ul className="space-y-4 text-sm text-on-surface-variant">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    Compte actif : Conservation intégrale.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    Géoloc : Écrasée après prestation.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    Voix : Anonymisée après amélioration IA.
                  </li>
                </ul>
              </div>
              <div className="bg-secondary/5 rounded-[2rem] p-8 border border-secondary/10">
                <h3 className="flex items-center gap-3 font-bold text-secondary mb-4">
                  <span className="material-symbols-outlined">security</span>
                  Mesures
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Chiffrement SSL/TLS, accès restreint et bases sécurisées
                  conformes aux standards. Bien que nous fassions le maximum, le
                  risque zéro n&apos;existe pas sur internet.
                </p>
              </div>
            </div>
          </section>

          <section
            className="animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                5
              </div>
              VOS DROITS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Accès & Portabilité",
                "Rectification",
                "Effacement (Oubli)",
                "Opposition",
              ].map((droit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-outline-variant/50 shadow-sm hover:border-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">
                      done_all
                    </span>
                  </div>
                  <span className="font-bold text-on-surface text-sm sm:text-base">
                    {droit}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-8 bg-on-surface rounded-[2rem] text-white flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10 text-center sm:text-left">
                <h4 className="text-xl font-bold mb-2">Une question ?</h4>
                <p className="text-sm text-surface-variant/80">
                  Réponse garantie sous 30 jours.
                </p>
              </div>
              <a
                href="mailto:privacy@koup-app.com"
                className="relative z-10 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
              >
                privacy@koup-app.com
              </a>
            </div>
          </section>

          <section
            className="text-center pt-8 animate-fade-in"
            style={{ animationDelay: "0.7s" }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              Retour à l&apos;accueil
            </Link>
          </section>
        </div>

        <div className="bg-surface-container-low/50 px-8 py-8 border-t border-outline-variant/30 text-center text-xs text-outline font-medium">
          © {new Date().getFullYear()} Koup. Tous droits réservés. <br />
          <span className="opacity-50 mt-1 block tracking-widest">
            DESIGNED FOR EXCELLENCE
          </span>
        </div>
      </div>
    </div>
  );
}
