import CommunityNav from "@/app/community/CommunityNav";

export default function Loading() {
  return (
    <>
      <CommunityNav />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`community_loading-${i}`} className="py-1">
          <div className="w-full h-[32px] bg-gray-400 animate-pulse" />
        </div>
      ))}
    </>
  );
}
