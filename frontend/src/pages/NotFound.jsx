import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

export default function NotFound() {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <h1 className="text-2xl font-semibold text-slate-950">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block"><Button>Go to dashboard</Button></Link>
    </Card>
  );
}
