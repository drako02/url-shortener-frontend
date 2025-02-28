export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex  h-full">
      <div className="w-3/5 bg-black rounded-r-xl"></div>
      <div className=" w-1/2 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
