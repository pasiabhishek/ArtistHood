import { useEffect } from "react";

export default function useTitle(title) {
  // Keeping titles in one hook makes browser tabs consistent across pages.
  useEffect(() => {
    document.title = "ArtistHood | " + title;
  }, [title]);
}