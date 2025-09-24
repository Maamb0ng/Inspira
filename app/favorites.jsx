import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebaseConfig";

export default function FavoriteQuotes() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  const fetchFavorites = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);
    const favs = [];
    snapshot.forEach((docSnap) => {
      favs.push({ id: docSnap.id, ...docSnap.data() });
    });
    setFavorites(favs);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
    await deleteDoc(doc(db, "favorites", id));
    fetchFavorites();
  };

  const renderItem = ({ item }) => (
    <View style={styles.quoteBox}>
      <Text style={styles.quoteText}>{item.text}</Text>
      <TouchableOpacity onPress={() => removeFavorite(item.id)}>
        <AntDesign name="delete" size={22} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#00C9A7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        {/* Spacer element */}
        <View style={{ width: 28 }} />
      </View>

      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A", // deep navy background
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 40,
  },
  headerTitle: {
    color: "#EAEAEA", // clean light text
    fontSize: 20,
    fontWeight: "bold",
  },
  quoteBox: {
    padding: 15,
    backgroundColor: "#1B263B", // dark navy box
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  quoteText: {
    color: "#EAEAEA", // soft light text
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  emptyText: {
    color: "#A0A0B2",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
