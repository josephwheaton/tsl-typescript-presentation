// * 1. annotation follows declaration
const parseAndAdd = (...numbers: string[]): number =>
  numbers.reduce((prev: number, curr: string): number => prev + parseInt(curr), 0);

// * 2. type inference
const mySum = parseAndAdd(`1`, `2`, `3`, `4`, `5`);

// * 3. new types
// ? may represent any value and is inferred if no other type can be inferred
let myStuff: any = {};
myStuff = "";
myStuff = 0;

// ? may also represent any value
let myOtherStuff: unknown = {};
myOtherStuff = "";
myOtherStuff = 0;

let myExtraStuff: object = {};
// myExtraStuff = "";
// ? unknown can only be assigned to unknown or any
// myExtraStuff = myOtherStuff;
myExtraStuff = myStuff;

const logger = (message: string): void => {
  console.log(`${message}`);
};

const thrower = (): never => {
  throw new Error(`This function never returns hence the return type is never.`);
};

// * 4. enums and string literal types
enum DefaultEnum {
  Zero,
  One,
  Two
}

enum SpecialNumbers {
  MeaningOfLife = 42,
  Unlucky = 13,
  DaysInAWeek = 7,
  Next,
  Eight = 8
}

let numDays: number = SpecialNumbers.DaysInAWeek;
let eight: string = SpecialNumbers[8];
console.log(`Value of eight is ${eight}`);

enum Colors {
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Blue = "\x1b[34m"
}

let myStringLiteral: "literal" = "literal";
// myStringLiteral = "vague";

// * 5. tuples
let tuple: [number, string, any];
tuple = [0, "", {}];
tuple = [0, "1", 2];

// * 6. interfaces
interface BasicIncome {
  salary: number;
}

interface Account {
  marketValue: number;
}

// * 7. extending interfaces
interface Income extends BasicIncome {
  rentalIncome: number;
}

let myIncome: Income = { salary: 0, rentalIncome: 0 };
// myIncome = { rentalIncome: 0 };
// myIncome = { salary: 0, rentalIncome: 0, extraProp: '' };

// * 8. merging declarations
interface Income {
  shadyBusiness?: number;
}

myIncome = { ...myIncome, shadyBusiness: 1000000 };

// * 9. types
type TypesOfMammals = "Eutheria" | "Marsupial" | "Monotreme" | "Unknown";
type Properties<T> = keyof T;

let incomeProperties: Properties<Income>;

// * 10. classes
interface IVision {
  vision: {
    type: "Binocular" | "Stereoscopic" | "N/A";
    colors: string[];
  };
  printInfo(): void;
}

// * 11. class implementing interface and 13. abstract classes
abstract class Animal implements IVision {
  hasBilateralSymmetry: boolean;
  vision: {
    type: "Binocular" | "Stereoscopic" | "N/A";
    colors: string[];
  };
  abstract printInfo(): void;
}

// * 12. class inheritance
abstract class Mammal extends Animal {
  static instances: number = 0; // ? static property
  type: TypesOfMammals;
  isCommonPet: boolean;
  // protected isCommonPet: boolean;

  // ! while you can provide overloaded constructor/method signatures, there
  // ! can only be one implementation only the final implemented version is
  // ! compiled and must be compatible with all other signatures  the implementation
  // ! may require type checking to make use of its overloaded signatures
  constructor();
  constructor(type: TypesOfMammals);
  constructor(type: TypesOfMammals, isCommonPet: boolean);
  constructor(type?: TypesOfMammals, isCommonPet?: boolean) {
    super();
    this.hasBilateralSymmetry = true;
    this.type = typeof type === undefined ? "Eutheria" : type;
    this.isCommonPet = typeof isCommonPet === undefined ? false : isCommonPet;
    Mammal.instances++;
  }
}

class Person extends Mammal {
  // * 14. access and 16. property modifiers
  private _fullName: string;
  public age: number;
  public favoriteColor: Colors;
  protected unknownProp: unknown;
  protected readonly extraStuff?: any;
  private netWorth?: number;

  constructor(params: Partial<Person> = {}) {
    super();
    // ? destructuring assignment with defaults
    ({
      fullName: this.fullName = `Joseph Ryan Wheaton`,
      age: this.age = 28,
      favoriteColor: this.favoriteColor = Colors.Green
    } = params);
  }

  public printInfo(): void {
    console.log(`${this.favoriteColor}%s\x1b[0m`, `My name is ${this.fullName}, I am ${this.age} years old.`);
  }

  // * 15. getters and setters
  get fullName() {
    return this._fullName;
  }

  set fullName(name) {
    this._fullName = name;
  }
}

class Sponge extends Animal {
  printInfo = () => {
    console.log(`Just a sponge.`);
  }
  constructor() {
    super();
    this.hasBilateralSymmetry = false;
  }
}

class Cat extends Mammal {
  constructor() {
    super();
    this.type = "Eutheria";
  }

  public printInfo() {
    console.log(`Meow`);
  }
}

class Kangaroo extends Mammal {
  constructor() {
    super();
    this.type = "Marsupial";
  }

  public printInfo() {
    console.log(`...`);
  }
}

class Alien {
  hasBilateralSymmetry: boolean;
  type: TypesOfMammals;
  vision: {
    colors: string[];
    type: "Binocular" | "Stereoscopic" | "N/A";
  };
  isCommonPet: boolean;

  constructor() {
    this.hasBilateralSymmetry = true;
    this.type = "Unknown";
    this.vision = {
      colors: [],
      type: "N/A"
    };
    this.isCommonPet = false;
  }

  printInfo() {
    console.log("Ayy");
  }
}

// ? structural vs nomimal typing in action
const people: Array<Mammal> = [
  new Person({ favoriteColor: Colors.Red }),
  new Person(),
  new Person({ favoriteColor: Colors.Blue }),
  new Cat(),
  new Cat(),
  new Cat(),
  new Kangaroo(),
  // new Sponge(),
  // ! alien has the same shape as mammal,
  // ! so it is considered valid by structural typing
  new Alien()
];

people.forEach(person => person.printInfo());

console.log(`We have %i instances of Mammal`, Mammal.instances);

// * 17 generics
interface UiModel<T> {
  data: T;
  errors: object;
}

let myUiIncome: UiModel<Income> = {
  data: {
    salary: 0,
    rentalIncome: 0
  },
  errors: undefined
};

// * 18 generic constraints
interface NaviPlanBaseModel {
  id: number;
}

interface ProfilesIncome {
  annualAmount: number;
}

interface NaviPlanAccount extends NaviPlanBaseModel {
  id: number;
  marketValue: number;
}

interface ApiModel<T extends NaviPlanBaseModel> {
  data: T;
}

// let myApiModel: ApiModel<ProfilesIncome> = {
//   data: {
//     annualAmount: 0
//   }
// };
