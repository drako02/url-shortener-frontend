export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex  h-full">
      <div className="w-1/2"></div>
      <div className=" w-1/2 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
