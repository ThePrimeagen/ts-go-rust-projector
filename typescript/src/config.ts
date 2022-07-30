import * as path from "path";
import { Opts } from "./opts";

export enum Operation {
    Print,
    Add,
    Remove,
}

export type Config = {
    args: string[],
    operation: Operation,
    config: string,
    pwd: string,
}

function getPwd(opts: Opts): string {
    if (opts.pwd) {
        return opts.pwd;
    }

    return process.cwd();
}

function getConfig(opts: Opts): string {
    if (opts.config) {
        return opts.config;
    }

    const home = process.env["HOME"];
    const loc = process.env["XDG_CONFIG_HOME"] || home;
    if (!loc) {
        throw new Error("unable to determine config location");
    }

    if (loc === home) {
        return path.join(loc, ".projector.json");
    }

    return path.join(loc, "projector", "projector.json");
}

function getOperation(opts: Opts): Operation {
    if (!opts.args || opts.args.length === 0) {
        return Operation.Print;
    }

    if (opts.args[0] === "add") {
        return Operation.Add;
    }

    if (opts.args[0] === "rm") {
        return Operation.Remove;
    }

    return Operation.Print;
}

function getArgs(opts: Opts): string[] {
    if (!opts.args || opts.args.length === 0) {
        return [];
    }

    const operation = getOperation(opts);
    if (operation === Operation.Print) {
        if (opts.args.length > 1) {
            throw new Error(`expected 0 or 1 arguments but got ${opts.args.length}`);
        }
        return opts.args;
    }

    if (operation === Operation.Add) {
        if (opts.args.length !== 3) {
            throw new Error(`expected 2 arguments but got ${opts.args.length - 1}`);
        }
        return opts.args.slice(1);
    }

    if (opts.args.length !== 2) {
        throw new Error(`expected 1 arguments but got ${opts.args.length - 1}`);
    }
    return opts.args.slice(1);
}

export default function config(opts: Opts): Config {
    return {
        pwd: getPwd(opts),
        config: getConfig(opts),
        args: getArgs(opts),
        operation: getOperation(opts),
    };
}
