import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { getServerSession } from "next-auth";
import SessionProvider from "~/components/auth/sessionProvider";
import BodyComponent from "~/components/navigation/bodyComponent";

export const metadata: Metadata = {
    title: "Expense tracker",
    description: "Expense tracker",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerSession();

    return (
        <html lang="en" suppressHydrationWarning>
            <SessionProvider session={session}>
                <body
                    className={`${GeistSans.variable} flex flex-col gap-4 font-sans`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <BodyComponent children={children} />
                    </ThemeProvider>
                </body>
            </SessionProvider>
        </html>
    );
}
