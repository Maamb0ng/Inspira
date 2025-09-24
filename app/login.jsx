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
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for back button
import { auth } from "../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- GOOGLE AUTH ---
  const [googleRequest, googleResponse, promptGoogleSignIn] =
    Google.useAuthRequest({
      expoClientId: "<YOUR_EXPO_GOOGLE_CLIENT_ID>",
      iosClientId: "<YOUR_IOS_GOOGLE_CLIENT_ID>",
      androidClientId: "<YOUR_ANDROID_GOOGLE_CLIENT_ID>",
      webClientId: "<YOUR_WEB_GOOGLE_CLIENT_ID>", // Firebase Web client ID
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

  // --- FACEBOOK AUTH ---
  const [fbRequest, fbResponse, promptFacebookSignIn] =
    Facebook.useAuthRequest({
      clientId: "<YOUR_FACEBOOK_APP_ID>",
    });

  useEffect(() => {
    if (fbResponse?.type === "success") {
      const { access_token } = fbResponse.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential)
        .then(() => router.replace("quotes"))
        .catch((error) => Alert.alert("Facebook Login Error", error.message));
    }
  }, [fbResponse]);

  // --- EMAIL LOGIN ---
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
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/")} // go to index.js
      >
        <Ionicons name="arrow-back" size={26} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to see quotes</Text>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          placeholderTextColor="#88A2B0"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor="#88A2B0"
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Divider text */}
        <Text style={styles.orText}>Or continue with</Text>

        {/* SOCIAL ICONS ROW */}
        <View style={styles.socialRow}>
          {/* GOOGLE SIGN IN */}
          <TouchableOpacity
            style={[styles.socialCircle, { backgroundColor: "#DB4437" }]}
            disabled={!googleRequest}
            onPress={() => promptGoogleSignIn()}
          >
            <Image
              source={require("../assets/images/google-logo.png")}
              style={styles.circleIcon}
            />
          </TouchableOpacity>

          {/* FACEBOOK SIGN IN */}
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

        {/* SIGN UP LINK */}
        <View style={styles.signupRow}>
          <Text style={{ color: "#88A2B0" }}>Don’t have an account?</Text>
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
    backgroundColor: "#0D1B2A", // Deep navy
    padding: 20,
    paddingTop: 60,
  },
  backBtn: {
    marginBottom: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B9AAA", // Cyan highlight
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF6B6B", // Coral accent
    marginBottom: 40,
  },
  form: { marginTop: 10 },
  label: { fontSize: 14, color: "#E0E0E0", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#1B9AAA",
    backgroundColor: "#1A2634",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  loginBtn: {
    backgroundColor: "#1B9AAA", // Cyan primary
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    color: "#AAAAAA",
    marginTop: 25,
    marginBottom: 10,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    gap: 20, // spacing between icons
  },
  socialCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  circleIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  signupText: { color: "#1B9AAA", fontWeight: "600" },
});
