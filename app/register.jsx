import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../firebaseConfig";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

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
        style={[styles.input, focusedInput === "name" && styles.inputFocused]}
        placeholder="Full Name"
        placeholderTextColor="#A0A8B0"
        value={name}
        onChangeText={setName}
        onFocus={() => setFocusedInput("name")}
        onBlur={() => setFocusedInput(null)}
      />
      <TextInput
        style={[styles.input, focusedInput === "email" && styles.inputFocused]}
        placeholder="Email"
        placeholderTextColor="#A0A8B0"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocusedInput("email")}
        onBlur={() => setFocusedInput(null)}
      />
      <TextInput
        style={[styles.input, focusedInput === "password" && styles.inputFocused]}
        placeholder="Password"
        placeholderTextColor="#A0A8B0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onFocus={() => setFocusedInput("password")}
        onBlur={() => setFocusedInput(null)}
      />

      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <LinearGradient
          colors={["#3AAFA9", "#2B9C92"]}
          style={styles.registerBtnGradient}
        >
          <Text style={styles.registerText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={{ color: "#A0A8B0" }}>Already have an account?</Text>
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
    backgroundColor: "#F0F4F8",
    padding: 25,
    paddingTop: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3AAFA9",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0BEC5",
    backgroundColor: "#FFFFFF",
    color: "#37474F",
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  inputFocused: {
    borderColor: "#3AAFA9",
    shadowOpacity: 0.15,
  },
  registerBtn: {
    borderRadius: 16,
    marginTop: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  registerBtnGradient: {
    padding: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  registerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  loginText: {
    color: "#3AAFA9",
    fontWeight: "600",
  },
});
