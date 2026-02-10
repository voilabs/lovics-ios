import { globSync } from "glob";
import { createRoute } from "./createRoute";
import Elysia from "elysia";

export class RouteLoader {
    path: string;
    constructor(path: string) {
        this.path = path;
    }

    load() {
        const routes = globSync(`${this.path}/**/*.ts`).filter(
            (route: any) => !route.split("\\").reverse()[0].startsWith("_"),
        );
        return routes
            .map((route) => {
                const routeModule = require("../../" + route);
                const routeConfig = routeModule.default;
                if (routeConfig instanceof Elysia) return routeConfig as any;
            })
            .filter(Boolean);
    }
}
