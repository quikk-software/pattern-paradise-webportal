import TokenWrapper from '@/app/wrappers/TokenWrapper';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TokenWrapper>{children}</TokenWrapper>;
}
