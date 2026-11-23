export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
      {Icon && (
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}