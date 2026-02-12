// lib/AlertContext.tsx
import { _setAlertHandler } from "@/lib/alert";
import { Button, ButtonRootProps, Dialog } from "heroui-native";
import React, {
    createContext,
    useState,
    useContext,
    useCallback,
    useEffect,
} from "react";
import { Text, View } from "react-native";

export interface AlertOptions {
    title: string;
    message: string;
    buttons: {
        text: string;
        onPress: (setIsOpen: (value: boolean) => void) => void;
        variant?: ButtonRootProps["variant"];
    }[];
}

const AlertContext = createContext<(options: AlertOptions) => void>(() => {});

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<AlertOptions | null>(null);

    const showAlert = useCallback((options: AlertOptions) => {
        if (!options.buttons?.length) {
            options.buttons = [
                {
                    text: "OK",
                    onPress: (setIsOpen) => setIsOpen(false),
                    variant: "primary",
                },
            ];
        }
        setConfig(options);
        setIsOpen(true);
    }, []);

    const handleClose = () => setIsOpen(false);

    return (
        <AlertContext.Provider value={showAlert}>
            {children}
            <Dialog isOpen={isOpen} onOpenChange={handleClose}>
                <Dialog.Portal>
                    <Dialog.Overlay />
                    <Dialog.Content>
                        <Dialog.Title>{config?.title}</Dialog.Title>
                        <View>
                            <Text className="mb-6">{config?.message}</Text>

                            <View className="flex flex-row items-center gap-2">
                                {config?.buttons.map((button) => (
                                    <Button
                                        key={button.text}
                                        onPress={() =>
                                            button.onPress(setIsOpen)
                                        }
                                        variant={button.variant}
                                        className="flex-1"
                                    >
                                        {button.text}
                                    </Button>
                                ))}
                            </View>
                        </View>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);
