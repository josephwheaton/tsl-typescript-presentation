// * 39 product types
// ? cardinality is the cartesian product of two types (ie, there are 24 possible values clock can take)
type Hour = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Period = "AM" | "PM";
// ? tuple in this context, basically a fixed length array
type Clock = [Hour, Period];

// * 40. sum types (discriminated, disjoint, or tagged union)
// ? more or less a union of 'tagged' types
type Action = Create | Update | Delete;

// ? the 3 members of our disjoint union
interface Create {
  tag: "CREATE"; // ! literal member type as tag
  description?: string;
  owner?: string;
  type?: string;
  costBasis?: number;
  marketValue?: number;
}
interface Update {
  tag: "UPDATE";
  id: number;
  description?: string;
  owner?: string;
  type?: string;
  costBasis?: number;
  marketValue?: number;
}
interface Delete {
  tag: "DELETE";
  id: number;
}

// #region | 3 constructors for our 3 members
const Create = (
  description?: string,
  owner?: string,
  type?: string,
  costBasis?: number,
  marketValue?: number
): Action => ({
  tag: "CREATE",
  description,
  owner,
  type,
  costBasis,
  marketValue
});
const Update = (
  id: number,
  description?: string,
  owner?: string,
  type?: string,
  costBasis?: number,
  marketValue?: number
): Action => ({
  tag: "UPDATE",
  id,
  description,
  owner,
  type,
  costBasis,
  marketValue
});
const Delete = (id: number): Action => ({
  tag: "DELETE",
  id
});
// #endregion

// * 41. switching over tag of disjoint union
// ? void is a type that contains one, trivial value
function doAction(a: Action): void {
  // ? btw, TS knows when you're in a switch case or if-else block with a particular tagged type,
  // ? you can operate on members of that particular type with no type errors
  switch (a.tag) {
    case "CREATE":
      return;
    case "UPDATE":
      a.description = "this is perfectly fine";
      return;
    case "DELETE":
      // a.description = 'what are you doing';
      return;
    default:
      // ? never is a type containing no values, a function returning this type does not return at all,
      // ? in this case we exhaustively check our sum types tag property and so should never hit the default
      // ? and so its return type would then be never
      const exhaustiveCheck: never = a;
      return exhaustiveCheck;
  }
}

doAction({ tag: "DELETE", id: 2 });
// doAction({ tag: 'READ', id: 1 });

// * 42. recursive sum type (stolen example)
type List<T> = { type: "Nil" } | { type: "Cons"; head: T; tail: List<T> };

// ? (recursive data type, base case, recursive step)
const fold = <T, U>(list: List<T>, onNil: () => U, onCons: (head: T, tail: List<T>) => U): U =>
  list.type === "Nil" ? onNil() : onCons(list.head, list.tail);

const sum = (list: List<number>): number =>
  fold(list, /* onNil */ () => 0, /* onCons */ (head, tail) => head + sum(tail));

let numbers: List<number> = {
  type: "Cons",
  head: 5,
  tail: {
    type: "Cons",
    head: 4,
    tail: {
      type: "Cons",
      head: 3,
      tail: {
        type: "Cons",
        head: 2,
        tail: {
          type: "Cons",
          head: 1,
          tail: {
            type: "Cons",
            head: 0,
            tail: {
              type: "Nil"
            }
          }
        }
      }
    }
  }
};

console.log(`Sum of recursively defined list of numbers: ${sum(numbers)}`);
