import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Vous pouvez ajouter une logique de routage supplémentaire ici
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        
        // Protéger le tableau de bord ou d'autres routes privées
        if (path.startsWith("/dashboard")) {
          return token !== null;
        }
        
        // Autoriser l'accès aux autres routes (ex: accueil, login)
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
