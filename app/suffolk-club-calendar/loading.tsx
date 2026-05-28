export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </header>
      
      <main className="pt-16 px-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </main>
    </div>
  );
}





