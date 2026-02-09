import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default function LibraryScreen() {
  const db = useSQLiteContext();
  const [itemCount, setItemCount] = useState<number | null>(null);
  const [dbVersion, setDbVersion] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      const countRow = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM library_items'
      );
      const versionRow = await db.getFirstAsync<{ version: string }>(
        'SELECT sqlite_version() as version'
      );

      if (!isMounted) {
        return;
      }

      setItemCount(countRow?.count ?? 0);
      setDbVersion(versionRow?.version ?? null);
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [db]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold text-black">Library</Text>
      <Text className="mt-2 text-sm text-black/70">
        Items: {itemCount ?? '...'}
      </Text>
      <Text className="mt-1 text-xs text-black/50">
        SQLite {dbVersion ?? '...'}
      </Text>
    </View>
  );
}
