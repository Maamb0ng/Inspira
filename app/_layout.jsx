// app/_layout.jsx
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hides the default header
      }}
    />
  );
}
