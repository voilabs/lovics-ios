import { View } from "react-native";
import { useContainer } from "../hooks/use-container";

export default function Container({
    children,
    removeTopAndBottom,
    removeAutoFlex,
    removeLeftAndRight,
    className,
}: {
    children: React.ReactNode;
    removeTopAndBottom?: boolean;
    removeAutoFlex?: boolean;
    removeLeftAndRight?: boolean;
    className?: string;
}) {
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
        useContainer({
            removeTopAndBottom,
            removeAutoFlex,
            removeLeftAndRight,
        });

    return (
        <View
            style={Object.assign(
                {
                    paddingLeft,
                    paddingRight,
                    paddingTop,
                },
                !removeAutoFlex && { flex: 1 },
            )}
            className={className}
        >
            {children}
        </View>
    );
}
