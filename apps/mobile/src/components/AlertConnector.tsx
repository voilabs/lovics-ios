import { _setAlertHandler } from "@/lib/alert";
import { useAlert } from "@/context/alert-context";
import { useEffect } from "react";

const AlertConnector = () => {
    const showAlert = useAlert();
    useEffect(() => {
        _setAlertHandler(showAlert);
    }, [showAlert]);
    return null;
};

export default AlertConnector;
