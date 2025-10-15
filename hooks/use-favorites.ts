"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  type: "venue" | "service";
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const storedFavorites = localStorage.getItem(
        `favorites_${session.user.id || session.user.email}`,
      );
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [session]);

  const addToFavorites = (item: FavoriteItem) => {
    if (!session?.user) return;

    const userId = session.user.id || session.user.email;
    const newFavorites = [...favorites, item];
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (id: string) => {
    if (!session?.user) return;

    const userId = session.user.id || session.user.email;
    const newFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
}
