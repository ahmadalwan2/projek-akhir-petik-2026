import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import axiosIntance from '../../utils/axiosIntance';

// Mock axiosIntance
vi.mock('../../utils/axiosIntance', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Login Component Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display "password salah" error below the password input', async () => {
    const errorMessage = 'Maaf, password salah';
    axiosIntance.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage },
        status: 401,
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Isi data & klik ingat saya (karena tombol disabled jika tidak dicentang)
    fireEvent.change(screen.getByPlaceholderText(/nexora@gmail.com/i), { target: { value: 'budi@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan kata sandi/i), { target: { value: 'salah123' } });
    fireEvent.click(screen.getByLabelText(/Ingat saya/i));
    
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    // Assert: Pesan harus muncul di bawah input (bukan sebagai alert generalError)
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
