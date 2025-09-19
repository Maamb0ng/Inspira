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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen() {
  const router = useRouter();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/events/eventlist"); // go to EventList after register
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account 🚀</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

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

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={{ color: "#777" }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginText}> Login</Text>
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
  registerBtn: {
    backgroundColor: "#FF5733", padding: 15,
    borderRadius: 10, marginTop: 20,
  },
  registerText: { color: "white", fontSize: 16, textAlign: "center", fontWeight: "600" },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  loginText: { color: "#FF5733", fontWeight: "600" },
});
