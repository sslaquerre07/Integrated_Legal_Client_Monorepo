import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  it('renders the main heading', () => {
    render(<Home />);

    expect(
      screen.getByText(/To get started, edit the/i)
    ).toBeInTheDocument();
  });
});
