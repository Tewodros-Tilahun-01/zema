import { usePlayerStore } from '@/store/playerStore';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { FullPlayer } from './FullPlayer';
import { MiniPlayer } from './MiniPlayer';

export function BottomSheetPlayer() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const { width, height } = useWindowDimensions();

  // Define snap points: mini player (70px) sits above tabs, full player (100% of screen)
  const snapPoints = useMemo(() => [70, '100%'], []); // Mini player height only

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentSnapIndex(index);
  }, []);

  const handleExpand = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleCollapse = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);
  // Custom backdrop that only shows when expanded
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={0} appearsOnIndex={1} opacity={0.5} />
    ),
    [],
  );

  if (!currentTrack) return null;

  const isMiniPlayer = currentSnapIndex === 0;

  let bottomInset = isMiniPlayer ? 90 : 0;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={false}
      backgroundStyle={styles.bottomSheetBackground}
      handleComponent={null}
      style={styles.bottomSheet}
      topInset={0}
      backdropComponent={renderBackdrop}
      enableOverDrag={false}
      bottomInset={bottomInset}
    >
      <BottomSheetView
        style={
          isMiniPlayer ? styles.miniContainer : { ...styles.fullContainer, minHeight: height + 40 }
        }
      >
        {isMiniPlayer ? (
          <MiniPlayer onExpand={handleExpand} />
        ) : (
          <FullPlayer onCollapse={handleCollapse} />
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    zIndex: 1000,
  },
  bottomSheetBackground: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  miniContainer: {
    height: 70,
  },
  fullContainer: {
    flex: 1,
  },
});
