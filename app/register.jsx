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

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={{ color: "#777" }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("login")}>
          <Text style={styles.loginText}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 80 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#222" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 15 },
  registerBtn: { backgroundColor: "#28a745", padding: 15, borderRadius: 10, marginTop: 10 },
  registerText: { color: "white", fontSize: 16, textAlign: "center", fontWeight: "600" },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  loginText: { color: "#28a745", fontWeight: "600" },
});
