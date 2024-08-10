import { useEffect, useRef } from "react";

// The reason why listenCapturing is set to true that the click event that cause modal to pop up will bubble up which will be trigger Event Listener in our custom hook
// but in other cases such in a menu toggle we don't want to listen during Capturing because that will prevent toggle button to close menu
export function useOutsideClick(callbackFn, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        callbackFn();
      }
    }

    document.addEventListener("click", handleClickOutside, listenCapturing);

    return () =>
      removeEventListener("click", handleClickOutside, listenCapturing);
  }, [callbackFn, listenCapturing]);

  return ref;
}
