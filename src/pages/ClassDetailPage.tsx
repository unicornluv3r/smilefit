import { useParams } from "react-router-dom";

export function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Class Details</h1>
      <p className="mt-2 text-muted-foreground">Class ID: {id}</p>
    </div>
  );
}
