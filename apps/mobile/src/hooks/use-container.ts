import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useContainer({
    removeTopAndBottom,
    removeAutoFlex,
    removeLeftAndRight,
}: {
    removeTopAndBottom?: boolean;
    removeAutoFlex?: boolean;
    removeLeftAndRight?: boolean;
}) {
    const insets = useSafeAreaInsets();
    const paddingLeft = removeLeftAndRight ? 0 : Math.max(insets.left, 16);
    const paddingRight = removeLeftAndRight ? 0 : Math.max(insets.right, 16);
    const paddingTop = removeTopAndBottom ? 0 : Math.max(insets.top, 16);
    const paddingBottom = removeTopAndBottom ? 0 : Math.max(insets.bottom, 0);

    return Object.assign(
        {
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom,
        },
        !removeAutoFlex && { flex: 1 },
    );
}
