"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";

export default function IdentityVerificationPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    if (token) {
      fetchPending();
    }
  }, [token]);

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/identity-verification/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingItems(res.data);
    } catch (error) {
      console.error("Failed to fetch pending verifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (id: string, decision: 'approved' | 'rejected', reason?: string) => {
    if (!token) return;
    try {
      await axiosInstance.post(`/identity-verification/${id}/review`, {
        decision,
        rejectionReason: reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedItem(null);
      fetchPending();
    } catch (error) {
      console.error("Failed to review", error);
      alert("Erreur lors de la validation");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-md p-lg">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-md border-b border-surface-variant">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background">Vérification d'Identité</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Validez les documents d'identité soumis par les utilisateurs.
            </p>
          </div>
        </div>

        {/* List */}
        {!selectedItem ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {isLoading ? (
              <div className="text-center p-8 col-span-full">Chargement...</div>
            ) : pendingItems.length > 0 ? (
              pendingItems.map(item => (
                <div key={item._id} className="bg-surface border border-outline-variant rounded-lg p-md flex flex-col gap-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-title-md text-on-surface font-bold">
                        {item.userId?.firstName} {item.userId?.lastName}
                      </h3>
                      <p className="text-on-surface-variant text-sm">{item.userId?.email}</p>
                      <span className="inline-block px-2 py-1 bg-primary-container text-on-primary-container text-xs rounded-full mt-2">
                        {item.userId?.role === 'salon' ? 'Salon' : 'Client'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto pt-sm border-t border-surface-variant">
                    <button 
                      onClick={() => setSelectedItem(item)}
                      className="w-full py-2 bg-primary text-on-primary rounded-md text-sm font-bold"
                    >
                      Examiner les documents
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-xl text-on-surface-variant bg-surface rounded-lg border border-outline-variant border-dashed col-span-full">
                Aucune demande en attente.
              </div>
            )}
          </div>
        ) : (
          /* Detail View */
          <div className="bg-surface border border-outline-variant rounded-lg p-lg">
            <button 
              onClick={() => setSelectedItem(null)}
              className="mb-4 text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Retour à la liste
            </button>
            
            <h3 className="font-headline-md font-bold mb-6">
              Examen : {selectedItem.userId?.firstName} {selectedItem.userId?.lastName}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-8">
              <div>
                <h4 className="font-title-md mb-2">Pièce d'identité</h4>
                <div className="aspect-[4/3] bg-surface-container-high rounded-lg overflow-hidden border border-outline-variant">
                  <img 
                    src={selectedItem.idDocumentUrl} 
                    alt="ID" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-title-md mb-2">Selfie</h4>
                <div className="aspect-[4/3] bg-surface-container-high rounded-lg overflow-hidden border border-outline-variant">
                  <img 
                    src={selectedItem.selfieUrl} 
                    alt="Selfie" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-md justify-end border-t border-surface-variant pt-md">
              <button 
                onClick={() => {
                  const reason = prompt("Raison du refus :");
                  if (reason) handleReview(selectedItem._id, 'rejected', reason);
                }}
                className="px-6 py-2 border border-error text-error rounded-md hover:bg-error-container"
              >
                Refuser
              </button>
              <button 
                onClick={() => handleReview(selectedItem._id, 'approved')}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approuver et Certifier
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
