// * 19. union types

interface Account {
  marketValue: number;
}
interface LifestyleAsset {
  marketValue: number;
  valuationDate: Date;
}
interface RealEstate {
  marketValue: number;
  rentalIncome: number;
}

// ? NetWorthModel can be one of three interfaces
type NetWorthModel = Account | LifestyleAsset | RealEstate;

// ? string literal union type
type HttpMethods = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

// * 20 narrowing a union type with type guards
function doStuff(model: NetWorthModel) {
  if (`valuationDate` in model || `rentalIncome` in model) {
    // ? it's a bit nasty partly due to structural typing, but TypeScript is
    // ? intelligent enough to know what type model must be in the conditionals
    console.log(`${model} is not an account`);
    if (`valuationDate` in model) {
      console.log(`${model} is a lifestyle asset`);
    } else {
      console.log(`${model} is a real estate asset`);
    }
  } else {
    console.log(`${model} is an account`);
  }
}

// todo: it would be much easier if there were a clear way to identify each
// todo: respective type in the union...

// * 21. intersection types
interface Customer {
  name: string;
}

interface Contact {
  phoneNumber: string;
}

type CustomerContact = Customer & Contact;

let contactInfo: CustomerContact;
contactInfo = { name: "Somebody", phoneNumber: "414-123-4567" };
// ! type error if object does not match both interfaces
// contactInfo = { name: "Nobody" };

// * 22. combining union and intersection types
interface Employee {
  badgeNumber: string;
  name: string;
}

// ? intersection operator & has higher precedence than union operator |
// ? use parenthesis to change order of precedence
type CustomerOrEmployeeCOontact = Customer | Employee & Contact;
type PersonContact = (Customer | Employee) & Contact;

// * 23. index type query operator (keyof T)
class Baz {
  foo: number;
  bar: string;
  baz?: boolean;
  qux() {
    console.log(`${this.foo}${this.bar}${this.baz}`);
  }
  quux(quuux: string) {
    return quuux.trim();
  }
  constructor() {
    this.foo = 5;
    this.bar = "bar";
    this.baz = false;
  }
}

// ? keyof T returns the property names of T as a union of string literalss
type Properties<T> = keyof T;

type props = Properties<Baz>;

// * 24. keyof typeof
const colors = {
  blue: "Sky",
  green: "Grass"
};
// ? capture key names of type of an instance value with keyof typeof
type Colors = keyof typeof colors;

// * 25. in operator
type Keys = "This" | "That" | 123;
// ? iterate over keys in T, map to booleans
type MapToString<T extends Keys> = { [K in T]: string };
type mappedKeys = MapToString<Keys>;

// * 26. indexed access
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name];
}

// * 27. type variables
// ? K is a type variable
type MapToSelf<T> = { [K in keyof T]: T[K] };
type justBaz = MapToSelf<Baz>;

// * 28. add and remove property modifiers
// ? set all properties in T optional
type Partial<T> = { [K in keyof T]?: T[K] };
type partialBaz = Partial<Baz>;

type Required<T> = { [K in keyof T]-?: T[K] };
type requiredBaz = Required<Baz>;

type ReadOnly<T> = { readonly [K in keyof T]: T[K] };
type readOnlyBaz = ReadOnly<Baz>;

// * 28. Pick built-in example
type Pick<T, K extends keyof T> = { [P in K]: T[K] };
type pickBaz = Pick<Baz, "baz">;

// * 29. Record built-in example
// ? every key K should be of type T
type Record<K extends keyof any, T> = { [P in K]: T };
type recordBaz = Record<keyof Baz, string>;

// ? type function that sets all values to strings
declare function allToString<T>(obj: T): Record<keyof T, string>;

// * 30. conditional types
type TypeSwapper<T> = { [K in keyof T]: T[K] extends string ? number : T[K] extends number ? string : T[K] };
type swapBazProps = TypeSwapper<Baz>;

// * 31. conditional distribution over union types
type unionOfStuff = "a" | { b: string } | 3 | boolean | number;
type DistributiveConditional<T> = T extends object ? T : T extends string ? T : never;
type stuff = DistributiveConditional<unionOfStuff>;

// * Remove types from T that are assignable to U
type Diff<T, U> = T extends U ? never : T;
// * Remove types from T that are not assignable to U
type Filter<T, U> = T extends U ? T : never;

// ! nevers are irrelevant and removed from final union type
type diff = Diff<"a" | "b" | "c" | "d" | 0, "a" | "c" | "f">; // 0 | "b" | "d"
type filter = Filter<"a" | "b" | "c" | "d" | 0, "a" | "c" | "f">; // "a" | "c"

// * 32. infer in conditional type
// ? An inferred generic type isn't part of the generic type signature,
// ? and can be used in conditional type resolution.
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type Bar<T, U> = T extends { a: U; b: U } ? U : never;

// ? U inferred as string
type foo1 = Foo<{ a: string; b: string }>;
// ! infer follows TS type inference rules
// ? U inferred as string | number
type foo2 = Foo<{ a: string; b: number }>;

// ! following two examples are more or less the same as 31. diff and filter,
// ! but these are the names of the built-ins
// * 33. Exclude built-in conditional type
// ? exclude all types from T that are assignable to K
type Exclude<T, U> = T extends U ? never : T;
type excludeBaz = Exclude<keyof Baz, "qux" | "quux">;

// * 34. Extract built-in conditional type
// ? extract all types T that are assignable to K
type Extract<T, U> = T extends U ? T : never;
type extractBaz = Extract<keyof Baz, "qux" | "quux">;

// * 35. extract non/function property names and properties (no slide)
interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type nonFunctionPropertyNames = NonFunctionPropertyNames<Part>;
type nonFunctionProps = NonFunctionProperties<Part>;

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type functionPropNames = FunctionPropertyNames<Part>;
type functionProps = FunctionProperties<Part>;

// * 36. Omit composed (now built-in) type example
interface Income {
  id: number;
  description?: string;
  owner?: string;
  type?: string;
  annualAmount?: number;
  amountPerPeriod?: number;
  externalId?: string;
  frequency?: string;
  startDate?: Date;
  endDate?: Date;
}

// ? return a type that omits properties K in T
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type omitIdIncome = Omit<Income, "id">;
const income0: Omit<Income, "id"> = {};

// * 37. AtLeastOne composed type example
// ? require at least one of any property in T
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
type atLeastOnePropIncome = AtLeastOne<Required<Income>>;
// const income1: atLeastOnePropIncome = {};

// * 38. Patch composed type example
// ? if T is an object, set all fields to required
type ObjectRequired<T> = T extends object ? { [P in keyof T]-?: NonNullable<T[P]> } : T;
type requiredIncome = ObjectRequired<Income>;

// ? putting it all together, we are going to type check a patch call by
// ? omitting the "id" property (as it is included in the endpoint) and requiring at least
// ? one other property
type Patch<T> = AtLeastOne<Omit<ObjectRequired<T>, "id">>;
type patchIncome = Patch<Income>;
// const income2: Patch<Income> = { id: 0 };
// const income3: Patch<Income> = {};
const income4: Patch<Income> = { description: "something" };
const income5: Patch<Income> = { description: "something", annualAmount: 365 };

// todo: probably better way to override built-in types
export type override = {};
