import { signIn } from '@/auth';

export default function Login() {
  return (
    <main className="flex size-full items-center justify-center bg-slate-900">
      <form
        action={async (formData) => {
          'use server';
          await signIn('credentials', formData);
        }}
        className="flex h-fit w-full max-w-xs flex-col gap-3 bg-slate-100 p-4 md:p-8"
      >
        <h1 className="text-center text-xl">Login</h1>
        <label className="flex flex-col">
          <span>CPF</span>
          <input name="cpf" type="text" />
        </label>
        <label className="flex flex-col">
          <span>Password</span>
          <input name="password" type="password" />
        </label>
        <input type="hidden" name="redirectTo"value="/issues" />
        <button type="submit" className="bg-blue-400 hover:bg-blue-500 active:bg-blue-600">
          Entrar
        </button>
      </form>
    </main>
  );
}
