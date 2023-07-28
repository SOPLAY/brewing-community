export default function Loading() {
  return (
    <div className="p-[30px]">
      <div className="h-[60px] w-full bg-gray-300 animate-pulse" />
      <div className="mt-4 flex flex-col gap-2">
        <div className="h-4 w-2/3 bg-gray-300 animate-pulse" />
        <div className="h-4 w-1/4 bg-gray-300 animate-pulse" />
        <div className="h-28 w-full bg-gray-300 animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-300 animate-pulse" />
      </div>
    </div>
  );
}
