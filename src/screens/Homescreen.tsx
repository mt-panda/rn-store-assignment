import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
import ProductCard from "../components/ProductCard";
import { getFavorites, toggleFavorite } from "../storage/Favourites";
import { Product } from "../types";

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...uniq];
  }, [products]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Text onPress={() => navigation.navigate("Favorites")} style={{ color: "#007AFF", fontWeight: "600" }}>
            Favourites
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchProducts();
    loadFavorites();
  }, []);

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

  const filtered = products.filter((p) => {
    const matchesQuery = p.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search products..."
        style={styles.searchInput}
      />

      <Text style={styles.sectionLabel}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={{ maxHeight: 44, marginTop: 10, paddingTop: 6 }}  
      >
        {categories.map((cat) => {
          const selected = cat === selectedCategory;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
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
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  categoriesContainer: {
    paddingVertical: 4,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  chipSelected: {
    backgroundColor: "#E8F0FE",
    borderColor: "#007AFF",
  },
  chipText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 13,
  },
  chipTextSelected: {
    color: "#007AFF",
  },
  listContent: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
