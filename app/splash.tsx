import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { colors, typography, spacing } from "@shared/presentation/styles/theme";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const opacity = useSharedValue(1);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.6);
  const logoY = useSharedValue(30);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(20);
  const wave1X = useSharedValue(-400);
  const wave2X = useSharedValue(-300);
  const wave3X = useSharedValue(-200);
  const pulse = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withTiming(1, { duration: 900 });
    logoScale.value = withSpring(1, { stiffness: 180, damping: 14 });
    logoY.value = withSpring(0, { stiffness: 180, damping: 14 });

    // Tagline stagger
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    taglineY.value = withDelay(400, withSpring(0, { stiffness: 200, damping: 18 }));

    // Waves
    wave1X.value = withRepeat(withTiming(500, { duration: 4000 }), -1, false);
    wave2X.value = withRepeat(withTiming(500, { duration: 5500 }), -1, false);
    wave3X.value = withRepeat(withTiming(500, { duration: 7000 }), -1, false);

    // Pulse
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 1200 }), withTiming(0, { duration: 1200 })),
      -1,
      false
    );

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) runOnJS(onFinish)();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { translateY: logoY.value }],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));
  const wave1Style = useAnimatedStyle(() => ({ transform: [{ translateX: wave1X.value }] }));
  const wave2Style = useAnimatedStyle(() => ({ transform: [{ translateX: wave2X.value }] }));
  const wave3Style = useAnimatedStyle(() => ({ transform: [{ translateX: wave3X.value }] }));
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.15, 0.35], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.08], Extrapolation.CLAMP) }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Ambient orbs */}
      <Animated.View style={[styles.orbTomato, pulseStyle]} />
      <Animated.View style={[styles.orbCafe, pulseStyle]} />

      {/* Waves */}
      <Animated.View style={[styles.wave1, wave1Style]} />
      <Animated.View style={[styles.wave2, wave2Style]} />
      <Animated.View style={[styles.wave3, wave3Style]} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <LottieView
          source={require("../assets/animations/pet-walk.json")}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
        <Animated.Text style={styles.brand}>PetAdopt</Animated.Text>
        <Animated.Text style={[styles.tagline, taglineStyle]}>
          Encuentra a tu compañero ideal
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    overflow: "hidden",
  },
  orbTomato: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
  },
  orbCafe: {
    position: "absolute",
    bottom: -40,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.accentLight,
  },
  wave1: {
    position: "absolute",
    bottom: -30,
    left: -400,
    width: 1000,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.primary,
    opacity: 0.42,
  },
  wave2: {
    position: "absolute",
    bottom: -60,
    left: -300,
    width: 900,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#C73E21",
    opacity: 0.55,
  },
  wave3: {
    position: "absolute",
    bottom: -90,
    left: -200,
    width: 800,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.primaryLight,
    opacity: 0.65,
  },
  logoContainer: {
    alignItems: "center",
    gap: 16,
    zIndex: 2,
  },
  lottie: { width: 200, height: 200 },
  brand: {
    fontSize: typography.size.hero,
    fontWeight: typography.weight.extrabold as any,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  tagline: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium as any,
    letterSpacing: 0.3,
  },
});
