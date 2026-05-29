import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { colors, typography } from "@shared/presentation/styles/theme";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const opacity = useSharedValue(1);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    // Entrance animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800 });

    // Exit animation after delay
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <LottieView
          source={require("../assets/animations/pet-walk.json")}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
        <Animated.Text style={styles.brand}>PetAdopt</Animated.Text>
        <Animated.Text style={styles.tagline}>
          Encuentra a tu compañero ideal
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  logoContainer: {
    alignItems: "center",
    gap: 12,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  brand: {
    fontFamily: typography.fontFamily.serif,
    fontSize: 36,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  tagline: {
    fontFamily: typography.fontFamily.body,
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
