import RootProvider from '@/provider/root-provider';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootProvider>{children}</RootProvider>;
}