import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import axiosInstance from '../../utils/axiosInstance';

// Mock axiosInstance
vi.mock('../../utils/axiosInstance', () => ({
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
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: { errors: backendErrors }, status: 400 }
    });

    render(<MemoryRouter><Register /></MemoryRouter>);
    
    // Isi data minimal agar bisa submit
    fireEvent.change(screen.getByPlaceholderText(/Masukkan username/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/nexora@gmail.com/i), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Buat kata sandi/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Ulangi kata sandi/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Daftar$/i }));

    await waitFor(() => {
      expect(screen.getByText('Email ini sudah terdaftar di sistem kami')).toBeInTheDocument();
    });
  });

  it('should display general error message as an alert for non-field errors', async () => {
    const errorMessage = 'Koneksi database terputus';
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage }, status: 500 }
    });

    render(<MemoryRouter><Register /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText(/Masukkan username/i), { target: { value: 'user2' } });
    fireEvent.change(screen.getByPlaceholderText(/nexora@gmail.com/i), { target: { value: 'test2@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Buat kata sandi/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Ulangi kata sandi/i), { target: { value: 'password123' } });
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
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Daftar$/i }));

    // Kita mengharapkan pesan validasi muncul (gunakan waitFor karena state update async)
    await waitFor(() => {
      expect(screen.getByText(/format email yang valid/i)).toBeInTheDocument();
    });
    
    // Pastikan API TIDAK dipanggil jika data tidak valid
    expect(axiosInstance.post).not.toHaveBeenCalled();
  });

  it('should display a user-friendly message for generic Validation error', async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: { data: { message: 'Validation error' }, status: 500 }
    });

    render(<MemoryRouter><Register /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText(/Masukkan username/i), { target: { value: 'kevin' } });
    fireEvent.change(screen.getByPlaceholderText(/nexora@gmail.com/i), { target: { value: 'kevin@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Buat kata sandi/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Ulangi kata sandi/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Daftar$/i }));

    await waitFor(() => {
      expect(screen.getByText('Pendaftaran gagal: Data sudah terdaftar, silakan gunakan data lain.')).toBeInTheDocument();
    });
  });
});
