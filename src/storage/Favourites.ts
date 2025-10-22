import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "FAVORITES_V1";

export async function getFavorites(): Promise<Record<number, boolean>> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("getFavorites error:", e);
    return {};
  }
}

export async function setFavorites(obj: Record<number, boolean>) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(obj));
    return obj;
  } catch (e) {
    console.error("setFavorites error:", e);
    return obj;
  }
}

export async function toggleFavorite(id: number) {
  try {
    const fav = (await getFavorites()) || {};
    if (fav[id]) delete fav[id];
    else fav[id] = true;
    await setFavorites(fav);
    return fav;
  } catch (e) {
    console.error("toggleFavorite error:", e);
    return {};
  }
}
