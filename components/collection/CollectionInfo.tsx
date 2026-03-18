import { StyleSheet, Text, View } from 'react-native';

type CollectionInfoProps = {
  collection: any;
  trackCount: number;
};

export default function CollectionInfo({ collection, trackCount }: CollectionInfoProps) {
  return (
    <View style={styles.headerContent}>
      <View style={styles.titleRow}>
        <Text style={styles.collectionName}>{collection.name}</Text>
        <Text style={styles.metaText}>
          {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
        </Text>
      </View>
      {collection.description && (
        <Text style={styles.collectionDescription}>{collection.description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: '#0B0E14',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  collectionName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  collectionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
});
