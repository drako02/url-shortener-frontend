import { Skeleton } from "@/components/ui/skeleton";

export const AuthLoader = () => {
  return (
    <div className=" w-full h-full flex flex-col justify-center items-center gap-2">
      {/* <div className="h-[48px] w-[65%] bg-gray-500 rounded-sm"></div>
      <div className="h-[48px] w-[65%]"></div> */}
      <Skeleton className="w-[65%] h-[30px] rounded-full mb-[20px]" />
      <Skeleton className="w-[65%] h-[48px] rounded-[10px]" />
      <Skeleton className="w-[65%] h-[48px] rounded-[10px]" />
      {/* <Skeleton className="w-[65%] h-[48px] rounded-[10px]" />
      <Skeleton className="w-[65%] h-[48px] rounded-[10px]" /> */}

      {/* <Skeleton className="w-[65%] h-[48px] rounded-[10px]" /> */}
      <Skeleton className="w-[65%] h-[48px] rounded-[10px] mt-[36px]" />


    </div>
  );
};
