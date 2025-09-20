import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />        {/* Landing/Login */}
      <Stack.Screen name="register" />     {/* Register */}
      <Stack.Screen name="home" />         {/* Quotes page */}
    </Stack>
  );
}
