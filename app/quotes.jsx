import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { auth, db } from "../firebaseConfig";
import { useFonts } from "expo-font";

const { width } = Dimensions.get("window");

export default function Quotes() {
  const [fontsLoaded] = useFonts({
    Cardo: require("../assets/fonts/Cardo-Regular.ttf"),
  });

  const builtInQuotes = [
    "Believe you can and you're halfway there.",
    "Do something today that your future self will thank you for.",
    "Happiness depends upon ourselves.",
    "In the middle of every difficulty lies opportunity.",
    "Turn your wounds into wisdom.",
  ];

  const [userQuotes, setUserQuotes] = useState([]);
  const [quotes, setQuotes] = useState(builtInQuotes);
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearted, setHearted] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "quotes"),
        where("userId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const qList = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        qList.push(data && data.text ? String(data.text) : "No text");
      });
      setUserQuotes(qList);
      setQuotes([...builtInQuotes, ...qList]);
    };
    fetchQuotes();
  }, []);

  useEffect(() => {
    const checkHeart = async () => {
      if (!auth.currentUser || quotes.length === 0) return;
      const quoteId = `${auth.currentUser.uid}_${currentIndex}`;
      const ref = doc(db, "favorites", quoteId);
      const snap = await getDoc(ref);
      setHearted((prev) => ({
        ...prev,
        [currentIndex]: snap.exists(),
      }));
    };
    checkHeart();
  }, [currentIndex, quotes]);

  const addQuote = async () => {
    if (input.trim() === "" || !auth.currentUser) return;

    await addDoc(collection(db, "quotes"), {
      text: input,
      userId: auth.currentUser.uid,
    });

    const newQuotes = [...userQuotes, input];
    setUserQuotes(newQuotes);
    setQuotes([...builtInQuotes, ...newQuotes]);
    setInput("");
  };

  const toggleHeart = async () => {
    if (!auth.currentUser || quotes.length === 0) return;
    const quoteId = `${auth.currentUser.uid}_${currentIndex}`;
    const ref = doc(db, "favorites", quoteId);

    if (hearted[currentIndex]) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        text: quotes[currentIndex],
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
    }

    setHearted((prev) => ({
      ...prev,
      [currentIndex]: !hearted[currentIndex],
    }));
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const onGestureEvent = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const { translationX } = nativeEvent;
      if (Math.abs(translationX) < 50) return;

      if (translationX < 0) {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
      }
    }
  };

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#F0F4F8" }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/favorites")}>
            <AntDesign name="heart" size={28} color="#FF6B6B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Quotes</Text>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="log-out-outline" size={28} color="#37474F" />
          </TouchableOpacity>
        </View>

        {/* QUOTE BOX */}
        <PanGestureHandler onHandlerStateChange={onGestureEvent}>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteLogo}>“</Text>
            <Text style={styles.quoteText}>
              {quotes.length > 0
                ? quotes[currentIndex]
                : "No quotes yet. Add one below!"}
            </Text>

            <TouchableOpacity
              onPress={toggleHeart}
              style={{ alignSelf: "center", marginTop: 15 }}
            >
              <AntDesign
                name="heart"
                size={28}
                color={hearted[currentIndex] ? "#FF6B6B" : "#ece2e2ff"} // red if liked, white if not
              />
            </TouchableOpacity>
          </View>
        </PanGestureHandler>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Add your own quote"
          placeholderTextColor="#A0A8B0"
        />
        <TouchableOpacity style={styles.addButton} onPress={addQuote}>
          <Text style={styles.addButtonText}>Add Quote</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.randomButton}
          onPress={() =>
            setCurrentIndex(Math.floor(Math.random() * quotes.length))
          }
        >
          <Text style={styles.randomButtonText}>Randomize Quote</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    marginTop: 40,
  },
  headerTitle: {
    color: "#37474F",
    fontSize: 20,
    fontWeight: "bold",
  },
  quoteBox: {
    width: "80%",
    minHeight: 200,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  quoteLogo: {
    fontSize: 50,
    color: "#3AAFA9",
    position: "absolute",
    top: 15,
    left: 15,
  },
  quoteText: {
    fontSize: 20,
    color: "#37474F",
    textAlign: "center",
    fontFamily: "Cardo",
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0BEC5",
    backgroundColor: "#FFFFFF",
    color: "#37474F",
    borderRadius: 12,
    padding: 12,
    width: "100%",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  addButton: {
    backgroundColor: "#3AAFA9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  randomButton: {
    backgroundColor: "#FF6B6B",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  randomButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
