import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1, { duration: 800 }),
      withDelay(
        1000,
        withTiming(30, { duration: 700 }, () => {
          if (onFinish) runOnJS(onFinish)();
        })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/images/splashScreenImage.png")}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",   
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
  },
});
