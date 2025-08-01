const EmptyState = ({ colSpan }: { colSpan: number }) => {
  return (
    <tr>
      <td className="text-center py-10 text-gray-500" colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center">
          <svg
            className="h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008h-.008V9.75zM9 14.25c1.5 1 4.5 1 6 0"
            />
          </svg>
          <p className="text-lg font-medium">No records found.</p>
        </div>
      </td>
    </tr>
  );
};

export default EmptyState;
