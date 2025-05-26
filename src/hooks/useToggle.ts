import { useState, useCallback } from 'react';

/**
 * Custom hook for managing a boolean state with a toggle function.
 *
 * @template T - Type of the initial value (defaults to boolean).
 * @param {T} initialValue - The initial boolean value.
 * @returns {UseToggleResult<T>} An object containing the current boolean state and a function to toggle it.
 *
 * @example
 * const { value, toggle } = useToggle(false);
 */
interface UseToggleResult<T = boolean> {
  value: T;
  toggle: () => void;
}

function useToggle<T extends boolean = boolean>(initialValue: T): UseToggleResult<T> {
  const [value, setValue] = useState<T>(initialValue);

  /**
   * Toggles the boolean state.
   * @function toggle
   * @returns {void}
   */
  const toggle = useCallback(() => {
    setValue((prevValue: T) => !prevValue as T);
  }, []);

  return { value, toggle };
}

export default useToggle;