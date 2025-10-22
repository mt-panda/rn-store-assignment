import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View, Text } from "react-native";
import { RootStackParamList } from "../../App";
import ProductCard from "../components/ProductCard";
import { getFavorites, toggleFavorite } from "../storage/Favourites";
import { Product } from "../types";

 type FavoritesNavProp = NativeStackNavigationProp<RootStackParamList, "Favorites">;

 interface Props {
  navigation: FavoritesNavProp;
}

export default function FavoritesScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchProducts();
    loadFavorites();
    const unsubscribe = navigation.addListener("focus", loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://fakestoreapi.com/products");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    const fav = await getFavorites();
    setFavorites(fav || {});
  };

  const onToggleFavorite = useCallback(async (id: number) => {
    const newFav = await toggleFavorite(id);
    setFavorites(newFav);
  }, []);

  const favProducts = products.filter((p) => favorites[p.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (favProducts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No favourites yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate("Details", { product: item })}
            isFavorite={!!favorites[item.id]}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
