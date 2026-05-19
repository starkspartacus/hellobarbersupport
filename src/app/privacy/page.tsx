import React from "react";

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 px-8 py-10 text-white">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
            Politique de Confidentialité et de Gestion des Données
          </h1>
          <p className="text-blue-100 text-lg">
            Koup - Dernière mise à jour : {currentDate}
          </p>
        </div>

        <div className="px-8 py-10 text-gray-700 space-y-10">
          <section className="prose prose-blue max-w-none">
            <p className="text-lg leading-relaxed">
              Bienvenue sur <strong className="text-gray-900">Koup</strong> (ci-après &quot;l&apos;Application&quot;). 
              La présente Politique de Confidentialité a pour but de vous informer de manière transparente sur la manière dont 
              nous collectons, utilisons, partageons et protégeons vos données personnelles lorsque vous utilisez notre Application, 
              que vous soyez un Client (B2C) ou un Professionnel (B2B).
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 text-blue-800">
              <p className="m-0 font-medium">
                En créant un compte et en utilisant Koup, vous acceptez expressément et sans réserve les termes de la présente 
                Politique de Confidentialité. Si vous n&apos;acceptez pas ces termes, veuillez ne pas utiliser l&apos;Application.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">1</span>
              DONNÉES QUE NOUS COLLECTONS
            </h2>
            <p className="mb-4 text-gray-600">Pour vous fournir un service optimal et instantané, nous collectons plusieurs types de données :</p>
            <ul className="space-y-4">
              <li className="flex">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <div>
                  <strong className="text-gray-900">Données d&apos;identification et de profil :</strong> Nom, prénom, adresse e-mail, numéro de téléphone, mot de passe crypté, photo de profil, et pour les professionnels : nom du salon, SIRET/Registre du commerce, spécialités.
                </div>
              </li>
              <li className="flex">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <div>
                  <strong className="text-gray-900">Données de Géolocalisation (Crucial) :</strong> Nous collectons les données de localisation précise de votre appareil (GPS) lorsque l&apos;Application est ouverte. Avec votre consentement au niveau de l&apos;appareil, nous pouvons également collecter votre position en arrière-plan afin de vous envoyer des offres commerciales géociblées pertinentes et d&apos;optimiser l&apos;algorithme de mise en relation.
                </div>
              </li>
              <li className="flex">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <div>
                  <strong className="text-gray-900">Données Vocales (Voice Bot) :</strong> Si vous utilisez notre fonctionnalité de réservation vocale, nous collectons, transcrivons et analysons vos requêtes vocales pour traiter votre demande et entraîner nos modèles d&apos;Intelligence Artificielle.
                </div>
              </li>
              <li className="flex">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <div>
                  <strong className="text-gray-900">Données de Transaction et de Prix :</strong> Historique des réservations, prix proposés, prix acceptés, moyens de paiement (les données bancaires brutes sont traitées par notre prestataire sécurisé Stripe et ne sont pas stockées sur nos serveurs).
                </div>
              </li>
              <li className="flex">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <div>
                  <strong className="text-gray-900">Données d&apos;Utilisation et Appareil :</strong> Adresse IP, modèle du smartphone, système d&apos;exploitation, temps passé sur l&apos;Application, clics, et interactions avec l&apos;interface.
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">2</span>
              UTILISATION DE VOS DONNÉES (FINALITÉS)
            </h2>
            <p className="mb-6 text-gray-600">
              Nous utilisons vos données dans un cadre strictement défini pour assurer le fonctionnement de l&apos;Application, 
              mais également pour développer notre entreprise. Vos données sont utilisées pour :
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-blue-600">A. La fourniture du service (Exécution du contrat)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> Créer et gérer votre compte.</li>
                  <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> Faire fonctionner l&apos;algorithme de Matchmaking (mise en relation Clients / Coiffeurs) basé sur les prix et la géolocalisation.</li>
                  <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> Traiter les paiements et générer les factures.</li>
                  <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> Vous envoyer des notifications (Push, SMS, E-mails) liées à vos rendez-vous.</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-blue-600">B. L&apos;amélioration de l&apos;Application (Intérêt légitime)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> Entraîner et perfectionner nos algorithmes d&apos;Intelligence Artificielle et de reconnaissance vocale.</li>
                  <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> Analyser les comportements des utilisateurs pour améliorer l&apos;UX/UI (interface utilisateur) et corriger les bugs.</li>
                  <li className="flex items-start"><span className="text-gray-400 mr-2">✓</span> Réaliser des statistiques globales sur les tendances de consommation (prix moyens, heures de pointe, types de coiffures les plus demandés).</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-blue-600">C. L&apos;exploitation Commerciale et Publicitaire <span className="text-sm font-normal text-gray-500">(Avec votre consentement / Intérêt légitime)</span></h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✓</span> 
                    <span><strong className="text-gray-900">Monétisation et Partenariats :</strong> Nous nous réservons le droit de partager ou de vendre des données statistiques agrégées et anonymisées à des partenaires tiers (marques de cosmétiques, instituts de beauté, régies publicitaires).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✓</span> 
                    <span><strong className="text-gray-900">Ciblage Publicitaire :</strong> Utiliser votre historique de réservation et votre géolocalisation pour vous pousser des offres promotionnelles ciblées dans l&apos;Application ou via des canaux externes (Réseaux sociaux, E-mails).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">✓</span> 
                    <span><strong className="text-gray-900">Partage avec des tiers affiliés :</strong> Nous pouvons partager certaines données comportementales non identifiantes directement avec des réseaux publicitaires (ex: Meta Ads, Google Ads) pour mesurer l&apos;efficacité de nos campagnes et recibler les utilisateurs.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">3</span>
              PARTAGE ET DIVULGATION DES DONNÉES
            </h2>
            <p className="mb-4 text-gray-600">
              Nous ne vendons pas vos données d&apos;identification directe (nom, e-mail, téléphone) à des courtiers en données (&quot;data brokers&quot;). 
              Toutefois, nous partageons vos données avec :
            </p>
            <ul className="space-y-4">
              <li className="flex">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <div>
                  <strong className="text-gray-900">Les autres utilisateurs :</strong> Si vous êtes client, votre prénom, photo et position approximative sont partagés avec le professionnel pour assurer la prestation. Si vous êtes professionnel, votre profil public est visible de tous.
                </div>
              </li>
              <li className="flex">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <div>
                  <strong className="text-gray-900">Nos Prestataires de Services (Sous-traitants) :</strong> Hébergeurs (ex: AWS, Google Cloud), processeurs de paiement (Stripe), services de notifications (Firebase), et outils d&apos;analyse (Google Analytics, Mixpanel).
                </div>
              </li>
              <li className="flex">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <div>
                  <strong className="text-gray-900">Partenaires Commerciaux :</strong> Comme mentionné dans la section 2.C, pour des opérations marketing conjointes.
                </div>
              </li>
              <li className="flex">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <div>
                  <strong className="text-gray-900">Autorités Légales :</strong> Nous divulguerons vos données si la loi, une injonction d&apos;un tribunal ou une autorité gouvernementale nous y oblige, ou pour protéger les droits, la propriété et la sécurité de l&apos;entreprise Koup.
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">4</span>
              CONSERVATION DES DONNÉES
            </h2>
            <ul className="space-y-3 bg-gray-50 rounded-xl p-6 border border-gray-100 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">▪</span>
                <span>Nous conservons vos données personnelles tant que votre compte est actif.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">▪</span>
                <span>Les données de géolocalisation brute sont régulièrement écrasées ou anonymisées après réalisation de la prestation.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">▪</span>
                <span>Les données vocales sont conservées le temps nécessaire à l&apos;amélioration de nos algorithmes, puis détruites ou anonymisées de manière irréversible.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">▪</span>
                <span>En cas de suppression de compte, nous conservons certaines données de transaction et de facturation à des fins d&apos;obligations légales et comptables pour une durée standard (ex: 5 à 10 ans selon les juridictions).</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">5</span>
              SÉCURITÉ
            </h2>
            <p className="text-gray-700 leading-relaxed bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles conformes aux standards de l&apos;industrie 
              (chiffrement SSL/TLS, bases de données sécurisées, accès restreint au personnel) pour protéger vos données contre l&apos;accès 
              non autorisé, la perte ou l&apos;altération. Toutefois, aucune transmission sur Internet n&apos;est sûre à 100 %, et nous 
              déclinons toute responsabilité en cas de faille de sécurité indépendante de notre volonté ou résultant d&apos;une force majeure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">6</span>
              VOS DROITS
            </h2>
            <p className="mb-6 text-gray-600">
              Conformément à la réglementation en vigueur (notamment le RGPD si applicable, ou les lois locales de protection des données), 
              vous disposez des droits suivants concernant vos données :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <strong className="block text-gray-900 mb-1 text-lg">Droit d&apos;accès et de portabilité</strong>
                <span className="text-gray-600 text-sm">Obtenir une copie des données que nous détenons sur vous.</span>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <strong className="block text-gray-900 mb-1 text-lg">Droit de rectification</strong>
                <span className="text-gray-600 text-sm">Modifier des données inexactes depuis les paramètres de l&apos;Application.</span>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <strong className="block text-gray-900 mb-1 text-lg">Droit à l&apos;effacement</strong>
                <span className="text-gray-600 text-sm">(&quot;Droit à l&apos;oubli&quot;) : Demander la suppression de votre compte et de vos données (sous réserve de nos obligations légales de conservation).</span>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <strong className="block text-gray-900 mb-1 text-lg">Droit d&apos;opposition</strong>
                <span className="text-gray-600 text-sm">Vous pouvez vous désinscrire de nos communications commerciales à tout moment en cliquant sur le lien de désabonnement ou en modifiant les paramètres de votre smartphone (pour la géolocalisation et les notifications Push).</span>
              </div>
            </div>
            <div className="bg-gray-900 text-white p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between">
              <p className="mb-4 sm:mb-0 text-center sm:text-left">
                Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse suivante. Nous disposons d&apos;un délai de 30 jours pour répondre à votre demande.
              </p>
              <a href="mailto:privacy@koup-app.com" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                privacy@koup-app.com
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">7</span>
              MODIFICATIONS DE LA POLITIQUE
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Koup</strong> se réserve le droit de modifier cette Politique de Confidentialité 
              à tout moment et à sa seule discrétion, afin de s&apos;adapter aux évolutions légales ou commerciales de l&apos;Application. 
              Toute modification substantielle vous sera notifiée via l&apos;Application ou par e-mail. Votre utilisation continue 
              de l&apos;Application après une modification vaut acceptation de la nouvelle Politique.
            </p>
          </section>
        </div>
        
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Koup. Tous droits réservés.
        </div>
      </div>
    </div>
  );
}
