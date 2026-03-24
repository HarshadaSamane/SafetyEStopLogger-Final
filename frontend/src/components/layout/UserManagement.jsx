const UserManagement = ({
  users,
  filteredUsers,
  userSearch,
  setUserSearch,
  roleFilter,
  setRoleFilter,
  handleDeleteUser,
  loading,
  onBack,
}) => {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-3 py-1.5 rounded-lg border bg-blue-50 hover:bg-gray-100 transition text-sm"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <br />
          <h2 className="text-3xl font-semibold text-blue-900">
            User Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage users, roles & permissions.{" "}
            <span className="text-red-500">
              Admins cannot delete other Admins.
            </span>
          </p>
        </div>

        {loading && (
          <div className="text-gray-500 text-sm animate-pulse">Loading...</div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="Operator">Operator</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mb-4 text-gray-600 text-sm">
        <span>
          Showing <strong>{filteredUsers.length}</strong> of {users.length}{" "}
          users
        </span>
        <span className="hidden md:inline text-gray-400">
          Tip: Use search to quickly find users.
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 border-b">
              <th className="py-3 pl-5 text-left font-medium text-gray-700">
                Name
              </th>
              <th className="py-3 text-left font-medium text-gray-700">
                Email
              </th>
              <th className="py-3 text-left font-medium text-gray-700">Role</th>
              <th className="py-3 pr-5 text-right font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          {/* Loading Skeleton */}
          {loading ? (
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="py-4 pl-5">
                    <div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="py-4">
                    <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="py-4">
                    <div className="h-5 w-16 bg-gray-200 animate-pulse rounded-full"></div>
                  </td>
                  <td className="py-4 pr-5 text-right">
                    <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : filteredUsers.length > 0 ? (
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 pl-5 font-medium text-gray-900">
                    {u.fullName}
                  </td>
                  <td className="py-4 text-gray-700">{u.email}</td>
                  <td className="py-4">
                    <span
                      className={
                        "px-2 py-1 rounded-full text-xs font-semibold " +
                        (u.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : u.role === "Supervisor"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800")
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 pr-5 text-right">
                    <button
                      disabled={u.role === "Admin"}
                      onClick={() => handleDeleteUser(u.id, u.role)}
                      className={
                        "px-3 py-1.5 rounded-md text-sm border transition " +
                        (u.role === "Admin"
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-red-50 hover:border-red-400 text-red-600")
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M4 13s-1 0-1 1 1 4 7 4 7-3 7-4-1-1-1-1H4z" />
                      </svg>
                    </div>
                    <p>No users match your filters.</p>

                    <button
                      onClick={() => {
                        setUserSearch("");
                        setRoleFilter("");
                      }}
                      className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm"
                    >
                      Clear filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
