import { AlertOptions } from "@/context/alert-context";

let alertFn: (options: AlertOptions) => void;

export const _setAlertHandler = (fn: typeof alertFn) => {
    alertFn = fn;
};

export const alert = (
    title: string,
    message: string,
    buttons?: AlertOptions["buttons"],
) => {
    if (alertFn) {
        alertFn({ title, message, buttons });
    } else {
        console.warn("AlertProvider henüz render edilmedi.");
    }
};
