// Shimmer "thinking" placeholder shown while Lumi is fetching a RAG answer.
// Three pulsing bars that mimic a loading chat bubble.
export function ShimmerBubble() {
  return (
    <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/10 px-4 py-4">
      <div className="flex flex-col gap-2.5">
        <div className="shimmer-bar h-3 w-[85%] rounded-full" />
        <div className="shimmer-bar h-3 w-[65%] rounded-full" style={{ animationDelay: '150ms' }} />
        <div className="shimmer-bar h-3 w-[45%] rounded-full" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
