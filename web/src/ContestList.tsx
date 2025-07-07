import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ContestList() {
  const { data, error } = useSWR('/api/contests', fetcher);

  if (error) return <div>Failed to load contests</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2">
      {data.map((c: any) => (
        <div key={c.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold">
            {c.sport.toUpperCase()} – {c.type}
          </h3>
          <p>{c.description}</p>
        </div>
      ))}
    </div>
  );
}
