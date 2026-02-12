import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button, FieldError, Input, Label, TextField } from "heroui-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeOutLeft,
} from "react-native-reanimated";
import Container from "./Container";

export interface FieldConfig {
    label?: string;
    name: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    icon: keyof typeof Ionicons.glyphMap;
    // Optional props
    secureTextEntry?: boolean;
    keyboardType?:
        | "default"
        | "number-pad"
        | "decimal-pad"
        | "numeric"
        | "email-address"
        | "phone-pad"
        | "url";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoFocus?: boolean;
    onSubmitEditing?: () => void;
    rightIcon?: {
        name: keyof typeof Ionicons.glyphMap;
        onPress: () => void;
    };
}

export interface Step {
    title: string;
    subtitle: string;
    fields?: FieldConfig[];
    buttonText?: string;
    onNext?: () => Promise<void | { input: string; message: string } | boolean>; // Return string for error
    content?: React.ReactNode; // Keep content for backward compatibility / flexibility
    footer?: React.ReactNode;
}

interface StepFormProps {
    steps: Step[];
    currentStep: number;
    onStepChange: (step: number) => void;
    bottomContent?: React.ReactNode;
}

export default function StepForm({
    steps,
    currentStep,
    onStepChange,
    bottomContent,
}: StepFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<{
        input: string;
        message: string;
    } | null>(null);

    const activeStep = useMemo(() => steps[currentStep], [currentStep]);

    const handleBack = () => {
        setError(null);
        if (currentStep > 0) {
            onStepChange(currentStep - 1);
        } else {
            router.back();
        }
    };

    const handleNext = async () => {
        setIsLoading(true);
        setError(null);
        if (activeStep.onNext) {
            const result = await activeStep.onNext();
            if (typeof result === "object") {
                setError(result);
                setIsLoading(false);

                const currentStepHasInput = activeStep.fields?.some(
                    (f) => f.name === result.input,
                );

                if (!currentStepHasInput) {
                    const stepIndex = steps.findIndex((s) =>
                        s.fields?.some((f) => f.name === result.input),
                    );
                    if (stepIndex !== -1 && stepIndex !== currentStep) {
                        onStepChange(stepIndex);
                    }
                }
            } else if (result === false) {
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } else {
            if (currentStep < steps.length - 1) {
                onStepChange(currentStep + 1);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (error) {
            const currentStepHasInput = steps[currentStep]?.fields?.some(
                (f) => f.name === error.input,
            );
            if (!currentStepHasInput) {
                setError(null);
            }
        }
    }, [currentStep]);

    return (
        <Container>
            <View className="flex-row items-center justify-start gap-4 pt-2 z-20">
                <Button
                    onPress={handleBack}
                    isIconOnly
                    variant="secondary"
                    size="sm"
                    animation="disable-all"
                    className="bg-white/20 text-white"
                >
                    <Ionicons
                        name={currentStep === 0 ? "arrow-back" : "chevron-back"}
                        size={16}
                        color="white"
                    />
                </Button>
                <Text className="text-white font-bold text-4xl tracking-tighter lowercase">
                    lovics.
                </Text>
            </View>

            <View className="flex-row gap-2 px-4 mt-6 mb-2 z-20">
                {steps.map((_, index) => (
                    <View
                        key={`step-indicator-${index}`}
                        className={`h-1 flex-1 rounded-full ${
                            index <= currentStep ? "bg-white" : "bg-white/20"
                        }`}
                    />
                ))}
            </View>

            <View className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        paddingBottom: 40,
                    }}
                >
                    <View className="space-y-6 flex-1 justify-center">
                        <View className="items-start mb-6">
                            <Animated.Text
                                key={`title-${currentStep}`}
                                entering={FadeInDown.duration(200)}
                                className="text-3xl font-bold text-foreground mb-1"
                            >
                                {activeStep.title}
                            </Animated.Text>
                            <Animated.Text
                                key={`sub-${currentStep}`}
                                entering={FadeInDown.duration(200).delay(50)}
                                className="text-muted text-base"
                            >
                                {activeStep.subtitle}
                            </Animated.Text>
                        </View>

                        <View className="min-h-0h-32 justify-center">
                            {/* Increased height slightly to accommodate error message */}
                            <Animated.View
                                entering={FadeInRight.duration(200)}
                                exiting={FadeOutLeft.duration(150)}
                                key={`content-${currentStep}`}
                                className="w-full"
                            >
                                {activeStep.fields ? (
                                    <View className="flex flex-col gap-4">
                                        {activeStep.fields.map(
                                            (field, index) => (
                                                <TextField
                                                    key={index}
                                                    className="space-y-1"
                                                    isInvalid={
                                                        error?.input ===
                                                        field.name
                                                    }
                                                >
                                                    {field.label && (
                                                        <Label>
                                                            {field.label}
                                                        </Label>
                                                    )}
                                                    <View>
                                                        <Input
                                                            placeholder={
                                                                field.placeholder
                                                            }
                                                            placeholderTextColor="#9ca3af"
                                                            value={field.value}
                                                            onChangeText={(
                                                                text,
                                                            ) => {
                                                                setError(null); // Clear error on edit
                                                                field.onChangeText(
                                                                    text,
                                                                );
                                                            }}
                                                            variant="secondary"
                                                            autoFocus
                                                            className="!pl-12"
                                                            {...field}
                                                        />
                                                        <View className="absolute left-4 top-0 bottom-0 justify-center pointer-events-none">
                                                            <Ionicons
                                                                name={
                                                                    field.icon
                                                                }
                                                                size={22}
                                                                color="#6b7280"
                                                            />
                                                        </View>
                                                        {field.rightIcon && (
                                                            <TouchableOpacity
                                                                onPress={
                                                                    field
                                                                        .rightIcon
                                                                        .onPress
                                                                }
                                                                className="absolute right-4 top-0 bottom-0 justify-center"
                                                            >
                                                                <Ionicons
                                                                    name={
                                                                        field
                                                                            .rightIcon
                                                                            .name
                                                                    }
                                                                    size={22}
                                                                    color="#6b7280"
                                                                />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                    <FieldError>
                                                        {error?.message}
                                                    </FieldError>
                                                </TextField>
                                            ),
                                        )}
                                    </View>
                                ) : (
                                    activeStep.content
                                )}
                            </Animated.View>
                        </View>

                        {activeStep.footer && (
                            <Animated.View entering={FadeInDown.duration(200)}>
                                {activeStep.footer}
                            </Animated.View>
                        )}

                        <Button
                            size="lg"
                            onPress={handleNext}
                            variant="primary"
                            className="mt-6"
                        >
                            <Button.Label className="text-white font-bold">
                                {isLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="white"
                                    />
                                ) : (
                                    activeStep.buttonText || "Devam Et"
                                )}
                            </Button.Label>
                        </Button>
                    </View>

                    {bottomContent && (
                        <View className="flex-row justify-center pt-4">
                            {bottomContent}
                        </View>
                    )}
                </ScrollView>
            </View>
        </Container>
    );
}
