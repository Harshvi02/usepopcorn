import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(() => {
    function handleKey(e) {
      if (e.code === key) {
        action();
      }
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [key, action]);
}

