import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInRight,
    FadeOut,
    FadeOutLeft,
    LinearTransition,
} from "react-native-reanimated";
import Container from "../../components/Container";

const { width } = Dimensions.get("window");

const CardItem = ({
    icon,
    title,
    subtitle,
    color = "#EF4444",
}: {
    icon: string;
    title: string;
    subtitle: string;
    color?: string;
}) => (
    <View className="flex-row items-center gap-3 p-4.5 border-b-[0.5px] border-foreground/5">
        <View className="w-10 h-10 rounded-full bg-muted/5 items-center justify-center">
            <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <View className="flex-1">
            <Text className="font-bold text-foreground text-sm">{title}</Text>
            <Text className="text-muted text-xs">{subtitle}</Text>
        </View>
        <Ionicons name="lock-closed" size={14} color="#94A3B8" />
    </View>
);

export default function OnboardingScreen() {
    const { t } = useTranslation();
    const muted = useThemeColor("muted");
    const router = useRouter();
    const stepData = [
        {
            color: "#ec4899",
            icon: "heart",
            specialCard: {
                title: t("onboarding.step1.card.title"),
                subtitle: t("onboarding.step1.card.subtitle"),
            },
            title: t("onboarding.step1.title"),
            subtitle: t("onboarding.step1.subtitle"),
        },
        {
            color: "#f59e0b",
            icon: "beer",
            specialCard: {
                title: t("onboarding.step2.card.title"),
                subtitle: t("onboarding.step2.card.subtitle"),
            },
            title: t("onboarding.step2.title"),
            subtitle: t("onboarding.step2.subtitle"),
        },
        {
            color: "#6366f1",
            icon: "shield-checkmark",
            specialCard: {
                title: t("onboarding.step3.card.title"),
                subtitle: t("onboarding.step3.card.subtitle"),
            },
            title: t("onboarding.step3.title"),
            subtitle: t("onboarding.step3.subtitle"),
        },
    ] as const;

    const [currentStep, setCurrentStep] = useState(0);
    const background = useThemeColor("background");
    const activeStep = stepData[currentStep];
    const accent = activeStep.color;

    // Auto-rotation logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % stepData.length);
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    return (
        <View className="flex-1">
            <StatusBar barStyle="light-content" animated translucent={true} />
            <LinearGradient
                colors={[accent, background]}
                locations={[0, 2]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.4 }}
                className="absolute inset-0"
            />

            <Animated.View
                key={`bg-${currentStep}`}
                entering={FadeIn.duration(1000)}
                className="absolute inset-0 overflow-hidden pointer-events-none"
            >
                <Ionicons
                    name={activeStep.icon as any}
                    size={45}
                    color="white"
                    style={{
                        position: "absolute",
                        top: "5%",
                        left: "20%",
                        opacity: 0.5,
                        transform: [{ rotate: "-25deg" }],
                    }}
                />
                <Ionicons
                    name={activeStep.icon as any}
                    size={120}
                    color="white"
                    style={{
                        position: "absolute",
                        top: "10%",
                        left: -20,
                        opacity: 0.5,
                        transform: [{ rotate: "-15deg" }],
                    }}
                />
                <Ionicons
                    name={activeStep.icon as any}
                    size={96}
                    color="white"
                    style={{
                        position: "absolute",
                        top: "30%",
                        right: -10,
                        opacity: 0.5,
                        transform: [{ rotate: "25deg" }],
                    }}
                />
                <Ionicons
                    name={activeStep.icon as any}
                    size={60}
                    color="white"
                    style={{
                        position: "absolute",
                        top: "18%",
                        right: "15%",
                        opacity: 0.5,
                        transform: [{ rotate: "25deg" }],
                    }}
                />
                <Ionicons
                    name={activeStep.icon as any}
                    size={45}
                    color="white"
                    style={{
                        position: "absolute",
                        top: "5%",
                        right: "5%",
                        opacity: 0.5,
                        transform: [{ rotate: "10deg" }],
                    }}
                />
            </Animated.View>

            <Container>
                <View className="flex-1">
                    {/* Header */}
                    <View className="flex-row items-center justify-center pt-6">
                        <Text className="text-white font-bold text-4xl tracking-tighter lowercase">
                            {t("onboarding.appName")}
                        </Text>
                    </View>

                    {/* Main Content Area */}
                    <View className="flex-1 items-center justify-center relative">
                        {/* Roadmap Connecting Line */}
                        <View
                            className="absolute w-0.5 border-l-2 border-dashed h-[60%] z-0"
                            style={{
                                left: "50%",
                                top: "20%",
                                transform: [{ rotate: "15deg" }],
                            }}
                        />

                        {/* Card 1: Back Card (Single Memory) */}
                        <Animated.View
                            key={`card1-${currentStep}`}
                            entering={FadeInRight.delay(100).springify()}
                            exiting={FadeOutLeft.duration(200)}
                            className="bg-background p-4 rounded-3xl shadow-sm z-10 self-start ml-5 -mr-6"
                            style={{
                                width: width * 0.6,
                                marginBottom: -72,
                                transform: [{ rotate: "-6deg" }],
                            }}
                        >
                            <View className="bg-background w-full h-28 rounded-xl mb-3 overflow-hidden shadow-inner">
                                {/* Placeholder for Image */}
                                <LinearGradient
                                    colors={[accent, background]}
                                    locations={[0, 1]}
                                    className="flex-1 items-center justify-center"
                                >
                                    <Ionicons
                                        name={activeStep.icon as any}
                                        size={32}
                                        color="white"
                                    />
                                </LinearGradient>
                            </View>
                            <View>
                                <Text className="font-bold text-foreground text-lg">
                                    {activeStep.specialCard.title}
                                </Text>
                                <Text className="text-muted text-xs flex-row items-center">
                                    {activeStep.specialCard.subtitle}
                                </Text>
                            </View>
                            <View className="mt-4 flex-row items-end justify-between">
                                <Text className="font-bold text-foreground text-xl">
                                    128{" "}
                                    <Text className="text-xs font-normal text-muted">
                                        {t("onboarding.memoryLabel")}
                                    </Text>
                                </Text>
                            </View>
                        </Animated.View>

                        {/* Card 2: Front Card (Memory List) */}
                        <Animated.View
                            layout={LinearTransition}
                            className="bg-background rounded-3xl shadow-xl border border-foreground/10 overflow-hidden relative z-20 self-end mr-4"
                            style={{
                                width: width * 0.7,
                                transform: [{ rotate: "3deg" }],
                                marginTop: 20,
                            }}
                        >
                            {stepData.map((item, index) => (
                                <CardItem
                                    key={index}
                                    icon={item.icon}
                                    title={item.specialCard.title}
                                    subtitle={item.specialCard.subtitle}
                                    color={item.color}
                                />
                            ))}
                        </Animated.View>
                    </View>

                    {/* Text Content */}
                    <View className="px-8 pb-4 items-center min-h-[160px] justify-end">
                        <Animated.View
                            key={`text-${currentStep}`}
                            entering={FadeInDown.springify()}
                            exiting={FadeOut.duration(200)}
                            className="items-center"
                        >
                            <Text className="text-3xl font-bold text-foreground text-center mb-4">
                                {activeStep.title}
                            </Text>
                            <Text className="text-muted text-center text-lg leading-6">
                                {activeStep.subtitle}
                            </Text>
                        </Animated.View>
                    </View>

                    {/* Pagination Dots */}
                    <View className="flex-row justify-center gap-1 mb-4">
                        {stepData.map((_, index) => (
                            <View
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentStep ? "w-8" : "w-2"
                                }`}
                                style={{
                                    backgroundColor:
                                        index === currentStep ? accent : muted,
                                }}
                            />
                        ))}
                    </View>

                    {/* Bottom Button */}
                    <View className="px-6 pb-12">
                        <TouchableOpacity
                            onPress={() => router.push("/(onboarding)/sign-in")}
                            activeOpacity={0.9}
                        >
                            <View
                                className="p-4 rounded-full flex-row items-center justify-center gap-2"
                                style={{ backgroundColor: accent }}
                            >
                                <Text className="text-white font-bold text-lg">
                                    {t("onboarding.startButton")}
                                </Text>
                                <Ionicons
                                    name="arrow-forward"
                                    size={24}
                                    color="white"
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        </View>
    );
}
