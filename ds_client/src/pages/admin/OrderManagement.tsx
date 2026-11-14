export default function orderManagement() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="rounded-xl text-md py-3 px-6  text-gray-600 dark:text-white text-md bg-white dark:bg-gray-800 shadow-md">
              Add, view, update and manage customer orders.
            </p>
          </div>
          <div>
            <p className="py-3 px-5 rounded-xl text-sm font-medium  text-gray-600 dark:text-white text-md bg-white dark:bg-gray-800 shadow-md">
              {/* Total Users : {users.length} */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
