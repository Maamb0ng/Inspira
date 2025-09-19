import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const router = useRouter();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/events/eventlist"); // go to EventList after login
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to book your next event</Text>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password..."
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={{ marginTop: 5 }}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={{ color: "#777" }}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
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
  input: {
    borderWidth: 1, borderColor: "#ddd", padding: 12,
    borderRadius: 8, marginBottom: 15,
  },
  forgot: { fontSize: 13, color: "#888", alignSelf: "flex-end" },
  loginBtn: {
    backgroundColor: "#FF5733", padding: 15,
    borderRadius: 10, marginTop: 20,
  },
  loginText: { color: "white", fontSize: 16, textAlign: "center", fontWeight: "600" },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  signupText: { color: "#FF5733", fontWeight: "600" },
});
