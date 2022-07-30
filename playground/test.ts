
type Foo = {
    bar?: string;
}

function doSomething(foo: Foo): boolean {

    if (foo.bar) {
        return true;
    } else {
        // ...c
        return false;
    }

}

