import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), { email, name });
      router.replace("quotes");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 🎉</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#88A2B0"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#88A2B0"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#88A2B0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={{ color: "#88A2B0" }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("login")}>
          <Text style={styles.loginText}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A", // Deep navy (same as login)
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1B9AAA", // Cyan highlight (same as login)
  },
  input: {
    borderWidth: 1,
    borderColor: "#1B9AAA",
    backgroundColor: "#1A2634", // Dark input background
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  registerBtn: {
    backgroundColor: "#1B9AAA", // Cyan primary
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  registerText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: {
    color: "#FF6B6B", // Coral accent (matches login subtitle)
    fontWeight: "600",
  },
});
