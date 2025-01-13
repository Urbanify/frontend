import { api } from '@/services/api';

export default async function Page() {
  const { data } = await api.city.getAll();

  return (
    <div>
      <h1>Issues</h1>
      <pre className="max-w-[300px] overflow-hidden md:max-w-[unset]">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
