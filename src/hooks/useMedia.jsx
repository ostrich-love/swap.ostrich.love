import { useState, useEffect } from 'react';

function useMedia(query, initialValue = false) {
  const [matches, setMatches] = useState(initialValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleMatchChange = event => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleMatchChange);
    return () => mediaQuery.removeEventListener('change', handleMatchChange);
  }, [query]);

  return matches;
}



export default useMedia