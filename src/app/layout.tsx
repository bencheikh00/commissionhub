import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import '../styles/animations.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'CommissionHub — Espace Collaboratif Sécurisé',
  description: 'Plateforme collaborative sécurisée pour la Commission Communication — messagerie, gestion des membres et suivi des activités administratives.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={plusJakartaSans.variable}>
<<<<<<< HEAD
      <body className={plusJakartaSans.className}>
        {children}
</body>
=======
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
      </head>
      <body className={plusJakartaSans.className}>
        {children}
      </body>
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
    </html>
  );
}