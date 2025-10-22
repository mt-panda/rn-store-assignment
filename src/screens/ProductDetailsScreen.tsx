import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import { getFavorites, toggleFavorite } from "../storage/Favourites";

type DetailsRouteProp = RouteProp<RootStackParamList, "Details">;
type DetailsNavProp = NativeStackNavigationProp<RootStackParamList, "Details">;

interface Props {
  route: DetailsRouteProp;
  navigation: DetailsNavProp;
}

export default function ProductDetailsScreen({ route, navigation }: Props) {
  const { product } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    (async () => {
      const fav = await getFavorites();
      setIsFavorite(!!fav[product.id]);
    })();
  }, [product.id]);

  const onToggle = async () => {
    const fav = await toggleFavorite(product.id);
    setIsFavorite(!!fav[product.id]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onToggle} style={{ paddingHorizontal: 8 }}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? "red" : "#333"} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageHeader}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${product.price}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>{product.description}</Text>
          <TouchableOpacity onPress={onToggle} style={styles.favCta}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={18} color={isFavorite ? "red" : "#111"} />
            <Text style={styles.favCtaText}>{isFavorite ? "Remove from favourites" : "Add to favourites"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  imageHeader: {
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 280,
    resizeMode: "contain",
  },
  priceBadge: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priceText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  category: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F0FE",
    color: "#1B66FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 10,
    textTransform: "capitalize",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    color: "#222",
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
  },
  favCta: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  favCtaText: {
    fontWeight: "700",
    color: "#111",
  },
});
