import Container from "@/components/Container";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "heroui-native";
import { ReactNode } from "react";
import { Image, Text, View } from "react-native";
// @ts-ignore
import splashScreen from "@/../assets/splashscreen.png";

export default function Header({
    title,
    subtitle,
    onBack,
    rightContent,
}: {
    title?: string;
    subtitle?: string;
    onBack?: () => void;
    rightContent?: ReactNode;
}) {
    return (
        <View className="mb-6">
            <View className="relative flex-row items-center justify-between min-h-[44px]">
                <View className="flex-1 flex-row items-center justify-start z-10">
                    {onBack ? (
                        <Button
                            onPress={onBack}
                            variant="secondary"
                            isIconOnly
                            size="sm"
                            className="rounded-full"
                        >
                            <Ionicons
                                name="arrow-back"
                                size={18}
                                color="black"
                            />
                        </Button>
                    ) : (
                        !title && (
                            <View className="flex-row items-center">
                                <Image
                                    source={splashScreen}
                                    className="w-10 h-10 -ml-3"
                                />
                                <Text className="text-xl font-bold text-black">
                                    Lovics.
                                </Text>
                            </View>
                        )
                    )}
                </View>

                {title && (
                    <View className="absolute inset-x-0 items-center justify-center pointer-events-none">
                        <Text className="text-base font-bold text-black">
                            {title}
                        </Text>
                        {subtitle && !onBack && (
                            <Text className="text-xs text-gray-500">
                                {subtitle}
                            </Text>
                        )}
                    </View>
                )}
                <View className="flex-1 flex-row items-center justify-end z-10">
                    {rightContent}
                </View>
            </View>
            {!title && subtitle && (
                <View>
                    <Text className="text-gray-500 text-sm">{subtitle}</Text>
                </View>
            )}
        </View>
    );
}
