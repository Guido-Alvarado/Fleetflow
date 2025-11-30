const Skeleton = ({ className = "", variant = "text" }) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";
  
  const variants = {
    text: "h-4 rounded",
    circle: "rounded-full",
    rect: "rounded-lg",
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              {[...Array(columns)].map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <Skeleton variant="text" className="w-24 h-4" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(rows)].map((_, i) => (
              <tr key={i}>
                {[...Array(columns)].map((_, j) => (
                  <td key={j} className="px-6 py-4 whitespace-nowrap">
                    <Skeleton variant="text" className="w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <Skeleton variant="text" className="w-24 h-4" />
              <Skeleton variant="text" className="w-16 h-8" />
            </div>
            <Skeleton variant="circle" className="w-12 h-12" />
          </div>
          <Skeleton variant="text" className="w-32 h-3" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
