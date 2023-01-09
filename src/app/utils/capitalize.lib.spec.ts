import { capitalize } from "./capitalize.lib";

describe('Capitalize', () => {
    it ("Should work correctly", () => {

        expect(capitalize("FOO")).toEqual("Foo");
        expect(capitalize("bar")).toEqual("Bar");
        expect(capitalize("FooBar")).toEqual("Foobar");
        expect(capitalize("bamBOOOZoole")).toEqual("Bambooozoole");
        expect(capitalize("#$%XXxx$")).toEqual("#$%xxxx$");
    });

});