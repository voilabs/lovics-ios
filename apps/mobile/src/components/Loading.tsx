import { ActivityIndicator, Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// @ts-ignore
import splashScreen from "@/../assets/splashscreen.png";

export default function Loading() {
    return (
        <View className="flex-1 items-center justify-center bg-background">
            <View className="flex-row items-center mb-4">
                <Image source={splashScreen} className="w-12 h-12 mr-2" />
                <Text className="text-xl font-bold text-black">Lovics.</Text>
            </View>
            <ActivityIndicator size="large" color="black" />
        </View>
    );
}
