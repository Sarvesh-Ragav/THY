'use client';

import { useCallback, useEffect, useState } from 'react';
import { emptyC31, loadC31, persistC31, type C31State } from '@/lib/c31';

export function useC31() {
  const [state, setState] = useState<C31State>(emptyC31);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadC31());
    setReady(true);
  }, []);

  const save = useCallback((next: C31State | ((current: C31State) => C31State)) => {
    setState((current) => {
      const resolved = typeof next === 'function' ? next(current) : next;
      persistC31(resolved);
      return resolved;
    });
  }, []);

  return { state, ready, save };
}
