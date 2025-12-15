import CookieChecker from "@/components/auth/CookieChecker";
import { Layout } from "@/components/layout";




export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookieChecker>
    <Layout>
      {children}
    </Layout>
    </CookieChecker>
  );
}