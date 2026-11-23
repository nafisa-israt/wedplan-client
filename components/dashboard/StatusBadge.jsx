const styles = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] || ""}`}
    >
      {status}
    </span>
  );
}