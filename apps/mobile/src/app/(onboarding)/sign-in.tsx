import { useTranslation } from "react-i18next";
import StepForm, { Step } from "@/components/StepForm";
import { useAuthContext } from "@/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import React, { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function SignInScreen() {
    const { t } = useTranslation();
    const accent = useThemeColor("accent");
    const background = useThemeColor("background");
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { handleSignIn } = useAuthContext();

    const steps: Step[] = [
        {
            title: t("signIn.step1.title"),
            subtitle: t("signIn.step1.subtitle"),
            buttonText: t("signIn.step1.button"),
            onNext: async () => {
                if (!email)
                    return {
                        input: "email",
                        message: t("signIn.step1.form.email.error.required"),
                    };

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return {
                        input: "email",
                        message: t("signIn.step1.form.email.error.invalid"),
                    };
                }
                setStep(1);
            },
            fields: [
                {
                    label: t("signIn.step1.form.email.label"),
                    name: "email",
                    placeholder: "example@lovics.app",
                    value: email,
                    onChangeText: setEmail,
                    icon: "mail-outline",
                    keyboardType: "email-address",
                    autoCapitalize: "none",
                    autoFocus: true,
                },
            ],
        },
        {
            title: t("signIn.step2.title"),
            subtitle: t("signIn.step2.subtitle"),
            buttonText: t("signIn.step2.button"),
            onNext: async () => {
                if (!password)
                    return {
                        input: "password",
                        message: t("signIn.step2.form.password.error.required"),
                    };
                const errorMessage = await handleSignIn(email, password);
                if (errorMessage) {
                    return {
                        input: "password",
                        message: errorMessage,
                    };
                }
            },
            footer: (
                <TouchableOpacity
                    className="self-end"
                    activeOpacity={0.9}
                    onPress={() => router.push("/(onboarding)/forgot-password")}
                >
                    <Text className="text-black font-medium mt-2">
                        {t("signIn.step2.forgotPassword")}
                    </Text>
                </TouchableOpacity>
            ),
            fields: [
                {
                    label: t("signIn.step2.form.password.label"),
                    name: "password",
                    placeholder: "********",
                    value: password,
                    onChangeText: setPassword,
                    icon: "lock-closed-outline",
                    secureTextEntry: !showPassword,
                    autoFocus: true,
                    rightIcon: {
                        name: showPassword ? "eye-off-outline" : "eye-outline",
                        onPress: () => setShowPassword(!showPassword),
                    },
                },
            ],
        },
    ];

    return (
        <View className="flex-1">
            <LinearGradient
                colors={[accent, background]}
                locations={[0, 2]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.3 }}
                className="absolute inset-0"
            />
            <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor="transparent"
            />

            <View className="absolute inset-0 overflow-hidden pointer-events-none">
                <Ionicons
                    name="cloud"
                    size={140}
                    color="white"
                    style={{
                        position: "absolute",
                        top: 40,
                        right: -40,
                        opacity: 0.8,
                    }}
                />
                <Ionicons
                    name="cloud"
                    size={100}
                    color="white"
                    style={{
                        position: "absolute",
                        top: 120,
                        left: -20,
                        opacity: 0.6,
                    }}
                />
                <Ionicons
                    name="cloud"
                    size={60}
                    color="white"
                    style={{
                        position: "absolute",
                        top: 80,
                        left: 100,
                        opacity: 0.4,
                    }}
                />
            </View>
            <StepForm
                steps={steps}
                currentStep={step}
                onStepChange={setStep}
                bottomContent={
                    <>
                        <Text className="text-muted">
                            {t("signIn.noAccount")}{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(onboarding)/sign-up")}
                            activeOpacity={0.9}
                        >
                            <Text className="text-foreground font-bold">
                                {t("signIn.signUp")}
                            </Text>
                        </TouchableOpacity>
                    </>
                }
            />
        </View>
    );
}
