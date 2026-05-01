import { Card } from './card'

export function PostSkeleton() {
  return (
    <Card className="mb-4">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        </div>

        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>

        <div className="h-48 bg-gray-200 rounded-lg animate-pulse mb-4" />

        <div className="flex items-center gap-4">
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  )
}

export function PostListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  )
}
