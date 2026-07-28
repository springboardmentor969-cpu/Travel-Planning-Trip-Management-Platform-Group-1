import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function NotFound() {
  return (
    <Card className="mx-auto max-w-xl overflow-hidden text-center">
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 px-6 py-10 text-white">
        <Compass className="mx-auto h-10 w-10 text-blue-200" />
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-300">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>
            <ArrowLeft className="h-4 w-4" />
            Go to dashboard
          </Button>
        </Link>
      </div>
    </Card>
  );
}
