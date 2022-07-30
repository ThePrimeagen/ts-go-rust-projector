import getConfig, { Operation } from "../config";

test("simple print all", function() {
    const config = getConfig({});
    expect(config.operation).toEqual(Operation.Print);
    expect(config.args).toEqual([]);
});

test("print key", function() {
    const config = getConfig({
        args: ["foo"],
    });
    expect(config.operation).toEqual(Operation.Print);
    expect(config.args).toEqual(["foo"]);
});

test("add key value", function() {
    const config = getConfig({
        args: ["add", "foo", "bar"],
    });
    expect(config.operation).toEqual(Operation.Add);
    expect(config.args).toEqual(["foo", "bar"]);
});

test("rm key", function() {
    const config = getConfig({
        args: ["rm", "foo"],
    });
    expect(config.operation).toEqual(Operation.Remove);
    expect(config.args).toEqual(["foo"]);
});
