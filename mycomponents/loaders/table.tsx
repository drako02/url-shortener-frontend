import { Skeleton } from "@/components/ui/skeleton";

export const TableLoader = () => {
  return (
    <div className="w-[84%] h-full flex flex-col justify-start items-center gap-3 p-[10%_1%]">
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      {/* <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" /> */}
      {/* <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" />
      <Skeleton className="w-[90%] h-[24px] rounded-[10px]" /> */}

    </div>
  );
};
