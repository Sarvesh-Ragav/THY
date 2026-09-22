import { redirect } from 'next/navigation';

/** Old admin login URL — use the shared /login page instead. */
export default function AdminLoginRedirectPage() {
  redirect('/login');
}
