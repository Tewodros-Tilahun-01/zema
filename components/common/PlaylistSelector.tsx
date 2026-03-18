import { Collection } from '@/db/schema';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type CollectionWithStatus = Collection & {
  isTrackInCollection: boolean;
  coverUrl: string | null;
};

type PlaylistSelectorProps = {
  collections: CollectionWithStatus[];
  onBack: () => void;
  onSelectCollection: (collection: CollectionWithStatus) => void;
};

export default function PlaylistSelector({
  collections,
  onBack,
  onSelectCollection,
}: PlaylistSelectorProps) {
  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Add to Playlist</Text>
      </View>

      {/* Collections List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {collections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No playlists yet</Text>
            <Text style={styles.emptySubtext}>Create a playlist first</Text>
          </View>
        ) : (
          collections.map((collection) => (
            <Pressable
              key={collection.id}
              style={styles.item}
              onPress={() => onSelectCollection(collection)}
            >
              <View style={styles.icon}>
                {collection.coverUrl && collection?.systemType !== 'favorites' ? (
                  <Image source={{ uri: collection.coverUrl }} style={styles.cover} />
                ) : (
                  <Ionicons
                    name={collection.systemType === 'favorites' ? 'heart' : 'musical-notes'}
                    size={20}
                    color={collection.systemType === 'favorites' ? '#FF3B30' : '#FFFFFF'}
                  />
                )}
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {collection.name}
                </Text>
                <Text style={styles.count}>{collection.trackCount} tracks</Text>
              </View>
              {collection.isTrackInCollection ? (
                <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
              ) : (
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
              )}
            </Pressable>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  icon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  count: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
