import Elysia, { type ElysiaConfig } from "elysia";
import type { App } from "../";

export const createRegisterableGroup = (
    config: ElysiaConfig<any>,
    fn: (app: App) => void,
) => {
    return { config, fn };
};

export const createRoute = <Prefix extends string>(
    config: ElysiaConfig<Prefix>,
    fn: (app: App) => void,
    externalConfig?: {
        groups?: ReturnType<typeof createRegisterableGroup>[];
    },
) => {
    const app = new Elysia(config) as unknown as App;
    fn(app);
    externalConfig?.groups?.forEach((group) => {
        app.group(group.config.prefix, (app) => {
            group.fn(app as unknown as App);
            return app;
        });
    });
    return app;
};
