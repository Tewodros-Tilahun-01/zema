import { createCollection, deleteCollection, getAllCollections } from '@/db/queries';
import { useCallback, useEffect, useState } from 'react';

export function useCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCollections = useCallback(async () => {
    setIsLoading(true);

    const data = await getAllCollections();
    setCollections(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const createNewCollection = useCallback(
    async (name: string, description?: string) => {
      const id = await createCollection(name, description);
      if (id) {
        await fetchCollections();
      }
      return id;
    },
    [fetchCollections],
  );

  const removeCollection = useCallback(
    async (collectionId: number) => {
      const success = await deleteCollection(collectionId);
      if (success) {
        await fetchCollections();
      }
      return success;
    },
    [fetchCollections],
  );

  return {
    collections,
    isLoading,
    refetch: fetchCollections,
    createCollection: createNewCollection,
    deleteCollection: removeCollection,
  };
}
