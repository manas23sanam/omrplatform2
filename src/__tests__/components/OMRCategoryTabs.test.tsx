import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { OMRCategoryTabs, OMR_CATEGORIES } from '../../components/student/OMRCategoryTabs';

describe('OMRCategoryTabs Component', () => {
  it('renders all 4 explicit categories: Physics, Chemistry, Biology, and Full Paper', () => {
    const handleSelect = vi.fn();
    render(<OMRCategoryTabs selectedCategory="Physics" onSelectCategory={handleSelect} />);

    expect(screen.getByRole('button', { name: /physics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chemistry/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /biology/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /full paper/i })).toBeInTheDocument();
  });

  it('triggers onSelectCategory callback on click', () => {
    const handleSelect = vi.fn();
    render(<OMRCategoryTabs selectedCategory="Physics" onSelectCategory={handleSelect} />);

    const biologyBtn = screen.getByRole('button', { name: /biology/i });
    fireEvent.click(biologyBtn);

    expect(handleSelect).toHaveBeenCalledWith('Biology');
  });

  it('highlights currently selected category', () => {
    const handleSelect = vi.fn();
    render(<OMRCategoryTabs selectedCategory="Chemistry" onSelectCategory={handleSelect} />);

    const chemBtn = screen.getByRole('button', { name: /chemistry/i });
    expect(chemBtn).toHaveClass('border-blue-600');
  });
});
