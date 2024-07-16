import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import TopNav from "~/navigation/topnav";
import { ThemeProvider } from "~/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "Expense tracker",
  description: "Expense tracker",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} flex flex-col gap-4 font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
