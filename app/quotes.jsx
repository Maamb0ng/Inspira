// app/quotes.jsx
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { addDoc, collection, getDocs } from "firebase/firestore";
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

const { width } = Dimensions.get("window");

export default function Quotes() {
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
  const router = useRouter();

  useEffect(() => {
    const fetchQuotes = async () => {
      const querySnapshot = await getDocs(collection(db, "quotes"));
      const q = [];
      querySnapshot.forEach((doc) => q.push(doc.data().text));
      setUserQuotes(q);
      setQuotes([...builtInQuotes, ...q]);
    };
    fetchQuotes();
  }, []);

  const addQuote = async () => {
    if (input.trim() === "") return;
    await addDoc(collection(db, "quotes"), { text: input });
    const newQuotes = [...userQuotes, input];
    setUserQuotes(newQuotes);
    setQuotes([...builtInQuotes, ...newQuotes]);
    setInput("");
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const onGestureEvent = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const { translationX } = nativeEvent;
      if (Math.abs(translationX) < 50) return; // ignore small swipes

      if (translationX < 0) {
        // swipe left
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
      } else {
        // swipe right
        setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <PanGestureHandler onHandlerStateChange={onGestureEvent}>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteLogo}>“</Text>
            <Text style={styles.quoteText}>
              {quotes.length > 0
                ? quotes[currentIndex]
                : "No quotes yet. Add one below!"}
            </Text>
          </View>
        </PanGestureHandler>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Add your own quote"
          placeholderTextColor="#aaa"
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

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  quoteBox: {
    width: "80%",
    minHeight: 200,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#372e2eff",
    justifyContent: "center",
    marginBottom: 20,
  },
  quoteLogo: {
    fontSize: 50,
    color: "#4CAF50",
    position: "absolute",
    top: 15,
    left: 15,
  },
  quoteText: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    color: "#fff",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16 },
  randomButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  randomButtonText: { color: "#fff", fontSize: 16 },
  logoutButton: { marginTop: 20 },
  logoutText: { color: "#FF5252", fontSize: 16 },
});
