import { clearRecentSearches, getRecentSearches, removeRecentSearch } from '@/db/queries';
import { RecentSearch } from '@/db/schema';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useRecentSearches = (limit: number = 10) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['recent-searches', limit],
    queryFn: async (): Promise<RecentSearch[]> => {
      return await getRecentSearches(limit);
    },
  });

  const clearAll = async () => {
    await clearRecentSearches();
    queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
  };

  const removeSearch = async (id: number) => {
    await removeRecentSearch(id);
    queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
  };

  return {
    ...query,
    clearAll,
    removeSearch,
    refresh,
  };
};
