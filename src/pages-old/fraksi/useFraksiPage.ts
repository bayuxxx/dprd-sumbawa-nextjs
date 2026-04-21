'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchAllFraksiInfo } from '../../services/api';
import type { FraksiInfo } from '../../services/api';

export function useFraksiPage(slug?: string) {
  const [fraksiList, setFraksiList] = useState<FraksiInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPeriode, setOpenPeriode] = useState<string | null>(null);
  const [selectedPeriode, setSelectedPeriode] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchAllFraksiInfo();
      setFraksiList(data);

      const periodeGroups = data.reduce<Record<string, FraksiInfo[]>>((acc, f) => {
        const key = f.masaJabatan?.periode || 'Tanpa Periode';
        if (!acc[key]) acc[key] = [];
        acc[key].push(f);
        return acc;
      }, {});
      const periodes = Object.keys(periodeGroups).sort((a, b) => b.localeCompare(a));

      // Periode dari query param atau default ke pertama
      const periodeParam = searchParams.get('periode');
      const initialPeriode = periodeParam && periodes.includes(periodeParam)
        ? periodeParam
        : periodes[0] ?? null;

      setOpenPeriode(initialPeriode);
      setSelectedPeriode(initialPeriode);
      setLoading(false);
    })();
  }, []);

  // Kalau ada slug, sync openPeriode ke periode fraksi yang dipilih
  const selectedFraksi = slug ? fraksiList.find(f => f.slug === slug) ?? null : null;

  const periodeGroups = fraksiList.reduce<Record<string, FraksiInfo[]>>((acc, f) => {
    const key = f.masaJabatan?.periode || 'Tanpa Periode';
    if (!acc[key]) acc[key] = [];
    acc[key].push(f);
    return acc;
  }, {});

  const periodes = Object.keys(periodeGroups).sort((a, b) => b.localeCompare(a));

  // Fraksi yang ditampilkan di halaman perolehan kursi = sesuai periode yang dipilih di sidebar
  const displayPeriode = selectedPeriode ?? periodes[0] ?? null;
  const fraksiBySelectedPeriode = displayPeriode ? (periodeGroups[displayPeriode] ?? []) : [];

  return {
    fraksiList,
    loading,
    openPeriode,
    setOpenPeriode,
    selectedPeriode,
    setSelectedPeriode,
    selectedFraksi,
    periodeGroups,
    periodes,
    fraksiBySelectedPeriode,
    displayPeriode,
  };
}
