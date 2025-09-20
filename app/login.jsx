import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("quotes");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to see quotes</Text>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter email" />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} placeholder="Enter password" />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={{ color: "#777" }}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("register")}>
            <Text style={styles.signupText}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 80 },
  title: { fontSize: 28, fontWeight: "bold", color: "#222" },
  subtitle: { fontSize: 16, fontWeight: "500", color: "#FF5733", marginBottom: 40 },
  form: { marginTop: 10 },
  label: { fontSize: 14, color: "#444", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 15 },
  loginBtn: { backgroundColor: "#FF5733", padding: 15, borderRadius: 10, marginTop: 20 },
  loginText: { color: "white", fontSize: 16, textAlign: "center", fontWeight: "600" },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  signupText: { color: "#FF5733", fontWeight: "600" },
});
