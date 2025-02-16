import { Providers } from './providers';
import "./globals.css";

export const metadata = {
  title: 'Star Wars Fleet',
  description: 'Explore and compare Star Wars starships',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
