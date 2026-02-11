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
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { handleSignUp } = useAuthContext();

    const steps: Step[] = [
        {
            title: t("signUp.welcome.title"),
            subtitle: t("signUp.welcome.subtitle"),
            buttonText: t("signUp.welcome.button"),
            onNext: async () => {
                if (!firstName)
                    return {
                        input: "firstName",
                        message: t(
                            "signUp.step1.form.firstName.error.required",
                        ),
                    };
                if (!lastName)
                    return {
                        input: "lastName",
                        message: t("signUp.step1.form.lastName.error.required"),
                    };

                setStep(1);
            },
            fields: [
                {
                    label: t("signUp.step1.form.firstName.label"),
                    name: "firstName",
                    placeholder: "John",
                    value: firstName,
                    onChangeText: setFirstName,
                    icon: "person-outline",
                    autoFocus: true,
                },
                {
                    label: t("signUp.step1.form.lastName.label"),
                    name: "lastName",
                    placeholder: "Doe",
                    value: lastName,
                    onChangeText: setLastName,
                    icon: "person-outline",
                    autoFocus: true,
                },
            ],
        },
        {
            title: t("signUp.step2.title"),
            subtitle: t("signUp.step2.subtitle"),
            buttonText: t("signUp.welcome.button"),
            onNext: async () => {
                if (!email)
                    return {
                        input: "email",
                        message: t("signUp.step2.form.email.error.required"),
                    };

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return {
                        input: "email",
                        message: t("signUp.step2.form.email.error.invalid"),
                    };
                }
                setStep(2);
            },
            fields: [
                {
                    label: t("signUp.step2.form.email.label"),
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
            title: t("signUp.step3.title"),
            subtitle: t("signUp.step3.subtitle"),
            buttonText: t("signUp.step3.button"),
            onNext: async () => {
                if (!password)
                    return {
                        input: "password",
                        message: t("signUp.step3.form.password.error.required"),
                    };
                if (!confirmPassword)
                    return {
                        input: "confirmPassword",
                        message: t(
                            "signUp.step3.form.confirmPassword.error.required",
                        ),
                    };
                if (password !== confirmPassword)
                    return {
                        input: "confirmPassword",
                        message: t(
                            "signUp.step3.form.confirmPassword.error.mismatch",
                        ),
                    };

                const errorMessage = await handleSignUp(
                    firstName,
                    lastName,
                    email,
                    password,
                );

                if (errorMessage) {
                    return {
                        input: "password",
                        message: errorMessage,
                    };
                }
            },
            fields: [
                {
                    label: t("signUp.step3.form.password.label"),
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
                {
                    label: t("signUp.step3.form.confirmPassword.label"),
                    name: "confirmPassword",
                    placeholder: "********",
                    value: confirmPassword,
                    onChangeText: setConfirmPassword,
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

            <View className="absolute inset-0 overflow-hidden pointer-events-none mt-6">
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
                            {t("signUp.hasAccount")}{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(onboarding)/sign-in")}
                            activeOpacity={0.9}
                        >
                            <Text className="text-foreground font-bold">
                                {t("signUp.signInLink")}
                            </Text>
                        </TouchableOpacity>
                    </>
                }
            />
        </View>
    );
}
