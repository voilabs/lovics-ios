import { useTranslation } from "react-i18next";
import StepForm, { Step } from "@/components/StepForm";
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import React, { useState, useEffect } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { alert } from "@/lib/alert";

export default function ForgotPasswordScreen() {
    const { t } = useTranslation();
    const accent = useThemeColor("accent");
    const background = useThemeColor("background");
    const router = useRouter();
    const [step, setStep] = useState(0);

    // Form State
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Timer State
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let interval: any;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [cooldown]);

    const sendCode = async () => {
        if (cooldown > 0) return;

        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "forget-password",
            });

            if (error) {
                alert(t("common.error"), error.message);
                return false;
            }

            setCooldown(120); // 120 seconds cooldown
            return true;
        } catch (e) {
            alert(t("common.error"), "An error occurred.");
            return false;
        }
    };

    const steps: Step[] = [
        {
            title: t("forgotPassword.step1.title"),
            subtitle: t("forgotPassword.step1.subtitle"),
            buttonText: t("forgotPassword.step1.button"),
            onNext: async () => {
                if (!email)
                    return {
                        input: "email",
                        message: t(
                            "forgotPassword.step1.form.email.error.required",
                        ),
                    };

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return {
                        input: "email",
                        message: t(
                            "forgotPassword.step1.form.email.error.invalid",
                        ),
                    };
                }

                const sent = await sendCode();
                if (sent) setStep(1);
            },
            fields: [
                {
                    label: t("forgotPassword.step1.form.email.label"),
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
            title: t("forgotPassword.step2.title"),
            subtitle: t("forgotPassword.step2.subtitle"),
            buttonText: t("forgotPassword.step2.button"),
            onNext: async () => {
                if (!otp)
                    return {
                        input: "otp",
                        message: t(
                            "forgotPassword.step2.form.otp.error.required",
                        ),
                    };

                const { error } =
                    await authClient.emailOtp.checkVerificationOtp({
                        email,
                        otp,
                        type: "forget-password",
                    });

                if (error) {
                    alert(t("common.error"), error.message);
                    return false;
                }

                setStep(2);
            },
            footer: (
                <TouchableOpacity
                    className="self-center mt-4"
                    disabled={cooldown > 0}
                    onPress={sendCode}
                >
                    <Text
                        className={`font-medium ${
                            cooldown > 0 ? "text-gray-400" : "text-black"
                        }`}
                    >
                        {cooldown > 0
                            ? t("forgotPassword.step2.resendIn", {
                                  seconds: cooldown,
                              })
                            : t("forgotPassword.step2.resendCode")}
                    </Text>
                </TouchableOpacity>
            ),
            fields: [
                {
                    label: t("forgotPassword.step2.form.otp.label"),
                    name: "otp",
                    placeholder: "123456",
                    value: otp,
                    onChangeText: setOtp,
                    icon: "key-outline",
                    keyboardType: "number-pad",
                    autoFocus: true,
                },
            ],
        },
        {
            title: t("forgotPassword.step3.title"),
            subtitle: t("forgotPassword.step3.subtitle"),
            buttonText: t("forgotPassword.step3.button"),
            onNext: async () => {
                if (!password)
                    return {
                        input: "password",
                        message: t(
                            "forgotPassword.step3.form.password.error.required",
                        ),
                    };
                if (password !== confirmPassword) {
                    return {
                        input: "confirmPassword",
                        message: t(
                            "forgotPassword.step3.form.confirmPassword.error.match",
                        ),
                    };
                }

                try {
                    const { error } = await authClient.emailOtp.resetPassword({
                        email,
                        password,
                        otp,
                    });

                    if (error) {
                        return {
                            input: "password",
                            message: error.message,
                        };
                    }

                    alert(
                        t("forgotPassword.success.title"),
                        t("forgotPassword.success.message"),
                        [
                            {
                                text: t("forgotPassword.success.button"),
                                onPress: () =>
                                    router.replace("/(onboarding)/sign-in"),
                            },
                        ],
                    );
                } catch (e) {
                    return {
                        input: "password",
                        message: "An error occurred.",
                    };
                }
            },
            fields: [
                {
                    label: t("forgotPassword.step3.form.password.label"),
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
                    label: t("forgotPassword.step3.form.confirmPassword.label"),
                    name: "confirmPassword",
                    placeholder: "********",
                    value: confirmPassword,
                    onChangeText: setConfirmPassword,
                    icon: "lock-closed-outline",
                    secureTextEntry: !showPassword,
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
                    <TouchableOpacity
                        onPress={() => router.push("/(onboarding)/sign-in")}
                        activeOpacity={0.9}
                    >
                        <Text className="text-foreground font-bold">
                            {t("forgotPassword.signInLink")}
                        </Text>
                    </TouchableOpacity>
                }
            />
        </View>
    );
}
