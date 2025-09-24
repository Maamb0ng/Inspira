import * as Facebook from "expo-auth-session/providers/facebook";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native"; // <-- make sure StyleSheet is imported here
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Needed for gradient buttons
import { auth } from "../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const [googleRequest, googleResponse, promptGoogleSignIn] =
    Google.useAuthRequest({
      expoClientId: "<YOUR_EXPO_GOOGLE_CLIENT_ID>",
      iosClientId: "<YOUR_IOS_GOOGLE_CLIENT_ID>",
      androidClientId: "<YOUR_ANDROID_GOOGLE_CLIENT_ID>",
      webClientId: "<YOUR_WEB_GOOGLE_CLIENT_ID>",
    });

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { id_token } = googleResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => router.replace("quotes"))
        .catch((error) => Alert.alert("Google Login Error", error.message));
    }
  }, [googleResponse]);

  const [fbRequest, fbResponse, promptFacebookSignIn] =
    Facebook.useAuthRequest({ clientId: "25276549398595080" });

  useEffect(() => {
    if (fbResponse?.type === "success") {
      const { access_token } = fbResponse.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential)
        .then(() => router.replace("quotes"))
        .catch((error) => Alert.alert("Facebook Login Error", error.message));
    }
  }, [fbResponse]);

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
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/")}>
        <Ionicons name="arrow-back" size={26} color="#3AAFA9" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to see quotes</Text>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, focusedInput === "email" && styles.inputFocused]}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#A0A8B0"
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setFocusedInput("email")}
          onBlur={() => setFocusedInput(null)}
        />
        <TextInput
          style={[
            styles.input,
            focusedInput === "password" && styles.inputFocused,
          ]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#A0A8B0"
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput(null)}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <LinearGradient
            colors={["#3AAFA9", "#2B9C92"]}
            style={styles.loginBtnGradient}
          >
            <Text style={styles.loginText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.orText}>Or continue with</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity
            style={[styles.socialCircle, { backgroundColor: "#F4B400" }]}
            disabled={!googleRequest}
            onPress={() => promptGoogleSignIn()}
          >
            <Image
              source={require("../assets/images/google-logo.png")}
              style={styles.circleIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialCircle, { backgroundColor: "#1877F2" }]}
            disabled={!fbRequest}
            onPress={() => promptFacebookSignIn()}
          >
            <Image
              source={require("../assets/images/facebook-logo.png")}
              style={styles.circleIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.signupRow}>
          <Text style={{ color: "#A0A8B0" }}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("register")}>
            <Text style={styles.signupText}> Sign up</Text>
          </TouchableOpacity>
        </View>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(58,175,169,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontSize: 30, fontWeight: "bold", color: "#3AAFA9", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#FF7F50", marginBottom: 35 },
  form: {},
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
  inputFocused: { borderColor: "#3AAFA9", shadowOpacity: 0.15 },
  loginBtn: {
    borderRadius: 16,
    marginTop: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  loginBtnGradient: {
    padding: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  loginText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  orText: { textAlign: "center", color: "#90A4AE", marginVertical: 20, fontSize: 14 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 20, marginVertical: 10 },
  socialCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  circleIcon: { width: 28, height: 28, resizeMode: "contain" },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  signupText: { color: "#3AAFA9", fontWeight: "600" },
});
