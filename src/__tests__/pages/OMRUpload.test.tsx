import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OMRUpload } from '../../pages/student/OMRUpload';
import { LearningStoreProvider } from '../../context/LearningStoreContext';

describe('OMRUpload Page (AC4)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderOMRUpload = () => {
    return render(
      <MemoryRouter>
        <LearningStoreProvider>
          <Routes>
            <Route path="/" element={<OMRUpload />} />
            <Route path="/student/upload" element={<OMRUpload />} />
            <Route path="/student/analysis/:testId" element={<div>Test Diagnostic Analysis Page Mock</div>} />
          </Routes>
        </LearningStoreProvider>
      </MemoryRouter>
    );
  };

  it('renders OMR upload interface with header and instructions', () => {
    renderOMRUpload();

    expect(screen.getByText('Categorized OMR Sheet Upload & AI Diagnostics')).toBeInTheDocument();
    expect(screen.getByText(/Optical Evaluation/i)).toBeInTheDocument();
  });

  it('provides explicit options for "Physics", "Chemistry", "Biology", and "Full Paper"', () => {
    renderOMRUpload();

    // Verify all 4 category options are present
    expect(screen.getByRole('button', { name: /physics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chemistry/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /biology/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /full paper/i })).toBeInTheDocument();
  });

  it('allows switching between category tabs', () => {
    renderOMRUpload();

    const physicsTab = screen.getByRole('button', { name: /physics/i });
    const chemTab = screen.getByRole('button', { name: /chemistry/i });
    const biologyTab = screen.getByRole('button', { name: /biology/i });
    const fullPaperTab = screen.getByRole('button', { name: /full paper/i });

    fireEvent.click(physicsTab);
    expect(physicsTab).toHaveClass('border-blue-600');

    fireEvent.click(chemTab);
    expect(chemTab).toHaveClass('border-blue-600');

    fireEvent.click(biologyTab);
    expect(biologyTab).toHaveClass('border-blue-600');

    fireEvent.click(fullPaperTab);
    expect(fullPaperTab).toHaveClass('border-blue-600');
  });

  it('provides preset sample OMR sheet picker', () => {
    renderOMRUpload();

    expect(screen.getByText('1-Click Demo: Sample OMR Sheets')).toBeInTheDocument();

    // Load sample 1
    const sampleButtons = screen.getAllByText(/Use Sample/i);
    expect(sampleButtons.length).toBeGreaterThan(0);

    fireEvent.click(sampleButtons[0]);
    expect(screen.getByText(/Loaded/i)).toBeInTheDocument();
  });

  it('launches multi-stage optical scan simulation visualizer', () => {
    renderOMRUpload();

    // Click Analyze & Grade button
    const startScanBtn = screen.getByRole('button', { name: /start ai evaluation/i });
    fireEvent.click(startScanBtn);

    // Visualizer should become active
    expect(screen.getByText(/AI Computer Vision Evaluation in Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Corner Detection/i)).toBeInTheDocument();
  });
});
