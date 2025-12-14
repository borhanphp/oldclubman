import React from "react";

export default function SearchResultsPanel({ results = [], searchValue = "" }) {
  if (!searchValue) return null;

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
        <div className="font-semibold text-lg mb-4">Connections</div>
        {results.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No results found.</div>
        ) : (
          results.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {/* Avatar placeholder */}
                  <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.status || "Following"}</div>
                </div>
              </div>
              <button
                className="px-5 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200 text-sm"
                disabled={user.following}
              >
                {user.following ? "Following" : "Follow"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}