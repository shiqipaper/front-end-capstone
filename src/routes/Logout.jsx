import { redirect } from 'react-router-dom';

// This action handles the actual logout logic
export async function action() {
  localStorage.removeItem('token');
  return redirect('/login');
}
