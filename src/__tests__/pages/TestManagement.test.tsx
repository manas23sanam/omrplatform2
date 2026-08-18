import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TestManagement } from '../../pages/teacher/TestManagement';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('TestManagement Page (F12, F13)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderTestManagement = () => {
    return render(
      <MemoryRouter>
        <LearningStoreProvider>
          <TestManagement />
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders Test Papers catalog and MCQ assignments section', () => {
    renderTestManagement();

    expect(screen.getByText('Test Paper & MCQ Assignment Management')).toBeInTheDocument();
    expect(screen.getByText(/Conducted Test Papers/i)).toBeInTheDocument();
    expect(screen.getByText(/Assigned Drills/i)).toBeInTheDocument();
  });

  it('opens Upload Question Paper modal and displays interactive ABCD answer key grid', () => {
    renderTestManagement();

    // Click "Upload Test Paper"
    const uploadButtons = screen.getAllByRole('button', { name: /upload (new )?test paper/i });
    fireEvent.click(uploadButtons[0]);

    // Modal title
    expect(screen.getByText('Upload & Configure Question Paper')).toBeInTheDocument();
    expect(screen.getByText(/Interactive Answer Key Grid/i)).toBeInTheDocument();

    // Quick fill buttons
    expect(screen.getByRole('button', { name: /all a/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all b/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /alternating/i })).toBeInTheDocument();
  });

  it('allows filling title, configuring answer key and publishing a new test paper', () => {
    renderTestManagement();

    const uploadButtons = screen.getAllByRole('button', { name: /upload (new )?test paper/i });
    fireEvent.click(uploadButtons[0]);

    // Fill Title
    const titleInput = screen.getByPlaceholderText(/e\.g\. neet advanced full mock test/i);
    fireEvent.change(titleInput, { target: { value: 'NEET 2026 Optics Special Mock' } });

    // Click All A quick tool
    const allABtn = screen.getByRole('button', { name: /all a/i });
    fireEvent.click(allABtn);

    // Submit form
    const publishBtn = screen.getByRole('button', { name: /publish paper & answer key/i });
    fireEvent.click(publishBtn);

    // Verify success banner and new paper in list
    expect(screen.getByText(/configured & published/i)).toBeInTheDocument();
    expect(screen.getByText('NEET 2026 Optics Special Mock')).toBeInTheDocument();
  });

  it('opens Assign MCQ Drill modal and dispatches targeted test', () => {
    renderTestManagement();

    const assignButtons = screen.getAllByRole('button', { name: /assign mcq drill/i });
    fireEvent.click(assignButtons[0]);

    expect(screen.getByText(/Assign Targeted MCQ Remediation Drill/i)).toBeInTheDocument();

    // Fill Assignment Title
    const titleInput = screen.getByPlaceholderText(/e\.g\. rotational torque sign remediation pack/i);
    fireEvent.change(titleInput, { target: { value: 'Rotational Equilibrium Mastery' } });

    // Submit assignment
    const dispatchBtn = screen.getByRole('button', { name: /dispatch drill/i });
    fireEvent.click(dispatchBtn);

    // Verify success alert
    expect(screen.getByText(/dispatched to/i)).toBeInTheDocument();
    expect(screen.getByText('Rotational Equilibrium Mastery')).toBeInTheDocument();
  });
});
