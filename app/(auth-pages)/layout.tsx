export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center py-10">
      <div className="flex flex-col gap-20 w-[30%] p-5">
        {children}
        {/* <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div> */}
      </div>
    </div>
  );
}
