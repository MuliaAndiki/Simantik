import { describe, expect, it } from 'bun:test';
import React from 'react';
import { Button } from '@/components/atoms/button';
import { Spinner, type SpinnerProps } from './Spinner';

describe('Spinner Component', () => {
  it('instantiates with default props', () => {
    const el = <Spinner />;
    expect(el.type).toBe(Spinner);
    expect(el.props.size).toBeUndefined();
  });

  it('supports explicit size variants', () => {
    const sizes: SpinnerProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl'];
    for (const size of sizes) {
      const el = <Spinner size={size} />;
      expect(el.props.size).toBe(size);
    }
  });

  it('accepts custom className and accessibility labels', () => {
    const el = <Spinner className="text-cyan-500" label="Sedang memuat data..." />;
    expect(el.props.className).toBe('text-cyan-500');
    expect(el.props.label).toBe('Sedang memuat data...');
  });
});

describe('Button Component with Loading State', () => {
  it('supports isLoading and loadingText props', () => {
    const button = (
      <Button isLoading loadingText="Menyimpan...">
        Simpan
      </Button>
    );
    expect(button.props.isLoading).toBe(true);
    expect(button.props.loadingText).toBe('Menyimpan...');
  });

  it('supports spinnerPlacement configuration', () => {
    const endButton = (
      <Button isLoading spinnerPlacement="end">
        Lanjut
      </Button>
    );
    expect(endButton.props.spinnerPlacement).toBe('end');
  });
});
