import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeArea({ children }: { children: React.ReactNode }) {
    const insets = useSafeAreaInsets();
    const paddingTop = Math.max(insets.top, 16);
    const paddingBottom = Math.max(insets.bottom, 16);

    return (
        <View
            style={{
                flex: 1,
                paddingTop,
                paddingBottom,
            }}
        >
            {children}
        </View>
    );
}
