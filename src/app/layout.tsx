import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./print.css";

const lexend = localFont({
  src: "./fonts/lexend/Lexend-Variable.ttf",
  variable: "--font-lexend",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  weight: "100 900",
});

const atkinson = localFont({
  src: [
    { path: "./fonts/atkinson/AtkinsonHyperlegible-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/atkinson/AtkinsonHyperlegible-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-atkinson",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "BinarAksara",
  description: "Ubah materi teks menjadi pengalaman membaca yang dapat disesuaikan, langsung di browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${lexend.variable} ${atkinson.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#konten-utama">
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
