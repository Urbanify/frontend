import { fetcher } from '@/services/api';

export default async function Page() {
  const response = await fetcher('/cities', {
    method: 'GET',
  });

  let data = [];
  if (response.ok) {
    data = await response.json() ?? [];
  }

  return (
    <div>
      <h1>Issues</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
