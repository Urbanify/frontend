import { fetcher } from '@/services/api';

export default async function Page() {
  const response = await fetcher('http://localhost:3000/cities', {
    method: 'GET',
  });
  const data = await response.json();
  // eslint-disable-next-line no-console
  console.log('data', data);

  return (
    <div>
      <h1>Issues</h1>
    </div>
  );
}
