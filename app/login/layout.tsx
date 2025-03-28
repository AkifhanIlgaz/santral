export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col w-full h-full items-center justify-center gap-8 ">
      {children}
    </section>
  );
}
