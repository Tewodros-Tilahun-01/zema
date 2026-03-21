import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getColors } from 'react-native-image-colors';

type ColorResult = {
  primary: string;
  secondary: string;
  background: string;
};

const DEFAULT_COLORS: ColorResult = {
  primary: '#121212',
  secondary: '#121212',
  background: '#121212',
};

export function useImageColors(imageUri: string | null) {
  const [colors, setColors] = useState<ColorResult>(DEFAULT_COLORS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUri) {
      setColors(DEFAULT_COLORS);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const extractColors = async () => {
      try {
        setIsLoading(true);
        const result = await getColors(imageUri, {
          fallback: DEFAULT_COLORS.primary,
          cache: true,
          key: imageUri,
        });

        if (!isMounted) return;

        let extractedColors: ColorResult;

        if (Platform.OS === 'android') {
          if (result.platform === 'android') {
            extractedColors = {
              primary: result.average || DEFAULT_COLORS.primary,
              secondary: result.average || DEFAULT_COLORS.secondary,
              background: result.darkMuted || DEFAULT_COLORS.background,
            };
          } else {
            extractedColors = DEFAULT_COLORS;
          }
        } else if (Platform.OS === 'ios') {
          if (result.platform === 'ios') {
            extractedColors = {
              primary: result.secondary || DEFAULT_COLORS.primary,
              secondary: result.secondary || DEFAULT_COLORS.secondary,
              background: result.background || DEFAULT_COLORS.background,
            };
          } else {
            extractedColors = DEFAULT_COLORS;
          }
        } else {
          extractedColors = DEFAULT_COLORS;
        }

        setColors(extractedColors);
      } catch (error) {
        console.error('Error extracting colors:', error);
        if (isMounted) {
          setColors(DEFAULT_COLORS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void extractColors();

    return () => {
      isMounted = false;
    };
  }, [imageUri]);

  return { colors, isLoading };
}
