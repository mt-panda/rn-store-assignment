import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../types";

interface Props {
  product: Product;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function ProductCard({
  product,
  onPress,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
      <TouchableOpacity onPress={onToggleFavorite} style={styles.heartButton}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? "red" : "#333"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 4,
  },
  heartButton: {
    padding: 8,
    justifyContent: "center",
  },
});
