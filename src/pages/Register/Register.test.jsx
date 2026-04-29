import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import axiosIntance from '../../utils/axiosIntance';

// Mock axiosIntance
vi.mock('../../utils/axiosIntance', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Register Component Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display specific field error message from backend below the input', async () => {
    const backendErrors = [{ message: 'Email ini sudah terdaftar di sistem kami' }];
    axiosIntance.post.mockRejectedValueOnce({
      response: { data: { errors: backendErrors }, status: 400 }
    });

    render(<MemoryRouter><Register /></MemoryRouter>);
    
    // Isi data minimal agar bisa submit
    fireEvent.change(screen.getByPlaceholderText(/nexora@gmail.com/i), { target: { value: 'test@gmail.com' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Daftar$/i }));

    await waitFor(() => {
      expect(screen.getByText('Email ini sudah terdaftar di sistem kami')).toBeInTheDocument();
    });
  });

  it('should display general error message as an alert for non-field errors', async () => {
    const errorMessage = 'Koneksi database terputus';
    axiosIntance.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage }, status: 500 }
    });

    render(<MemoryRouter><Register /></MemoryRouter>);
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Daftar$/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should display error message for invalid email format (Client-side)', async () => {
    render(<MemoryRouter><Register /></MemoryRouter>);
    
    const emailInput = screen.getByPlaceholderText(/nexora@gmail.com/i);
    fireEvent.change(emailInput, { target: { value: 'email-salah' } });
    fireEvent.click(screen.getByRole('button', { name: /Daftar$/i }));

    // Kita mengharapkan pesan validasi muncul (gunakan waitFor karena state update async)
    await waitFor(() => {
      expect(screen.getByText(/format email yang valid/i)).toBeInTheDocument();
    });
    
    // Pastikan API TIDAK dipanggil jika data tidak valid
    expect(axiosIntance.post).not.toHaveBeenCalled();
  });
});
