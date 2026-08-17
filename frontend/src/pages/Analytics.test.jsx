import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Analytics from './Analytics';

vi.mock('../api/tripService', () => ({ analyticsApi: { user: () => Promise.resolve({ totalBudget: 1000, totalSpent: 250, expensesByCategory: [], monthlyExpenses: [], tripBudgets: [] }) } }));

test('renders a personal analytics summary for an authenticated user', async () => {
  render(<Analytics />);
  expect(await screen.findByText('Travel spending analytics')).toBeInTheDocument();
  expect(screen.getByText('Total planned budget')).toBeInTheDocument();
  expect(screen.getAllByText('No data available yet.')).toHaveLength(3);
});
