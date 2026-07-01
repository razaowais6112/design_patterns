import type { PatternData } from '../types';

export const factory: PatternData = {
  id: 'factory',
  name: 'Factory Method',
  slug: 'factory',
  category: {
    id: 'creational',
    name: 'Creational',
    slug: '/creational',
    description: 'Concerned with how objects are created.'
  },
  order: 1,
  intent: 'Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.',
  problem: {
    narrative: `Imagine you run a burger restaurant. Your kitchen currently only knows how to make one thing: a beef burger. When an order comes in, your cook directly constructs a BeefBurger object. But now customers are asking for chicken burgers, veggie burgers, and fish burgers. Every time you add a new burger type, you have to modify your kitchen's order-handling code — adding new conditionals and direct instantiations. The kitchen becomes tightly coupled to every burger type that exists, and adding a new type means touching and retesting the same fragile code.`,
    code: {
      python: `class Kitchen:
    def prepare_order(self, burger_type: str) -> str:
        if burger_type == "beef":
            burger = BeefBurger()
        elif burger_type == "chicken":
            burger = ChickenBurger()
        elif burger_type == "veggie":
            burger = VeggieBurger()
        else:
            raise ValueError(f"Unknown burger type: {burger_type}")
        burger.prepare()
        burger.cook()
        return burger.serve()

class BeefBurger:
    def prepare(self): print("Preparing beef patty")
    def cook(self): print("Grilling beef patty")
    def serve(self): return "Beef burger served"

class ChickenBurger:
    def prepare(self): print("Preparing chicken patty")
    def cook(self): print("Frying chicken patty")
    def serve(self): return "Chicken burger served"

class VeggieBurger:
    def prepare(self): print("Preparing veggie patty")
    def cook(self): print("Baking veggie patty")
    def serve(self): return "Veggie burger served"`,
      javascript: `class Kitchen {
  prepareOrder(burgerType) {
    let burger;
    if (burgerType === "beef") {
      burger = new BeefBurger();
    } else if (burgerType === "chicken") {
      burger = new ChickenBurger();
    } else if (burgerType === "veggie") {
      burger = new VeggieBurger();
    } else {
      throw new Error("Unknown burger type: " + burgerType);
    }
    burger.prepare();
    burger.cook();
    return burger.serve();
  }
}

class BeefBurger {
  prepare() { console.log("Preparing beef patty"); }
  cook() { console.log("Grilling beef patty"); }
  serve() { return "Beef burger served"; }
}

class ChickenBurger {
  prepare() { console.log("Preparing chicken patty"); }
  cook() { console.log("Frying chicken patty"); }
  serve() { return "Chicken burger served"; }
}

class VeggieBurger {
  prepare() { console.log("Preparing veggie patty"); }
  cook() { console.log("Baking veggie patty"); }
  serve() { return "Veggie burger served"; }
}`,
      java: `class Kitchen {
    public String prepareOrder(String burgerType) {
        Burger burger;
        if (burgerType.equals("beef")) {
            burger = new BeefBurger();
        } else if (burgerType.equals("chicken")) {
            burger = new ChickenBurger();
        } else if (burgerType.equals("veggie")) {
            burger = new VeggieBurger();
        } else {
            throw new IllegalArgumentException("Unknown burger type: " + burgerType);
        }
        burger.prepare();
        burger.cook();
        return burger.serve();
    }
}

class BeefBurger implements Burger {
    public void prepare() { System.out.println("Preparing beef patty"); }
    public void cook() { System.out.println("Grilling beef patty"); }
    public String serve() { return "Beef burger served"; }
}

class ChickenBurger implements Burger {
    public void prepare() { System.out.println("Preparing chicken patty"); }
    public void cook() { System.out.println("Frying chicken patty"); }
    public String serve() { return "Chicken burger served"; }
}

class VeggieBurger implements Burger {
    public void prepare() { System.out.println("Preparing veggie patty"); }
    public void cook() { System.out.println("Baking veggie patty"); }
    public String serve() { return "Veggie burger served"; }
}

// Note: Burger interface is defined in the solution section
`
    },
    painPoints: [
      'Kitchen is tightly coupled to every concrete burger class — adding a new burger means editing Kitchen.',
      'Violates Open/Closed Principle: Kitchen must be modified to extend behavior.',
      'Conditional logic (if/elif/else) grows with every new burger type, making the code harder to read and test.',
      'Kitchen cannot work with burger types that don\'t exist yet — adding one requires code changes across the system.'
    ]
  },
  solution: {
    narrative: `We introduce a BurgerFactory interface with a single method: createBurger(). Each burger type gets its own factory class that implements this interface. Now Kitchen depends only on the abstract BurgerFactory and Burger interfaces — never on concrete classes. Adding a new burger means creating a new factory class, not touching Kitchen.`,
    code: {
      python: `from abc import ABC, abstractmethod

# The abstract product — defines the interface all burgers share
class Burger(ABC):
    @abstractmethod
    def prepare(self): pass
    @abstractmethod
    def cook(self): pass
    @abstractmethod
    def serve(self) -> str: pass

# The abstract factory — this interface is what enables decoupling
class BurgerFactory(ABC):
    @abstractmethod
    def create_burger(self) -> Burger: pass

class Kitchen:
    def __init__(self, factory: BurgerFactory):
        self.factory = factory  # Kitchen depends on abstraction, not concrete classes

    def prepare_order(self) -> str:
        burger = self.factory.create_burger()
        burger.prepare()
        burger.cook()
        return burger.serve()

# --- Concrete Products ---
class BeefBurger(Burger):
    def prepare(self): print("Preparing beef patty")
    def cook(self): print("Grilling beef patty")
    def serve(self): return "Beef burger served"

class ChickenBurger(Burger):
    def prepare(self): print("Preparing chicken patty")
    def cook(self): print("Frying chicken patty")
    def serve(self): return "Chicken burger served"

# --- Concrete Factories ---
class BeefBurgerFactory(BurgerFactory):
    def create_burger(self) -> Burger:
        return BeefBurger()

class ChickenBurgerFactory(BurgerFactory):
    def create_burger(self) -> Burger:
        return ChickenBurger()

# Usage:
kitchen = Kitchen(BeefBurgerFactory())
print(kitchen.prepare_order())`,
      javascript: `// The abstract product — defines the interface all burgers share
class Burger {
  prepare() { throw new Error("Abstract method"); }
  cook() { throw new Error("Abstract method"); }
  serve() { throw new Error("Abstract method"); }
}

// The abstract factory — this interface is what enables decoupling
class BurgerFactory {
  createBurger() { throw new Error("Abstract method"); }
}

class Kitchen {
  constructor(factory) {
    this.factory = factory;  // Kitchen depends on abstraction, not concrete classes
  }

  prepareOrder() {
    const burger = this.factory.createBurger();
    burger.prepare();
    burger.cook();
    return burger.serve();
  }
}

// --- Concrete Products ---
class BeefBurger extends Burger {
  prepare() { console.log("Preparing beef patty"); }
  cook() { console.log("Grilling beef patty"); }
  serve() { return "Beef burger served"; }
}

class ChickenBurger extends Burger {
  prepare() { console.log("Preparing chicken patty"); }
  cook() { console.log("Frying chicken patty"); }
  serve() { return "Chicken burger served"; }
}

// --- Concrete Factories ---
class BeefBurgerFactory extends BurgerFactory {
  createBurger() { return new BeefBurger(); }
}

class ChickenBurgerFactory extends BurgerFactory {
  createBurger() { return new ChickenBurger(); }
}

// Usage:
const kitchen = new Kitchen(new BeefBurgerFactory());
console.log(kitchen.prepareOrder());`,
      java: `// The abstract product — defines the interface all burgers share
interface Burger {
    void prepare();
    void cook();
    String serve();
}

// The abstract factory — this interface is what enables decoupling
interface BurgerFactory {
    Burger createBurger();
}

class Kitchen {
    private BurgerFactory factory;  // Kitchen depends on abstraction, not concrete classes

    public Kitchen(BurgerFactory factory) {
        this.factory = factory;
    }

    public String prepareOrder() {
        Burger burger = factory.createBurger();
        burger.prepare();
        burger.cook();
        return burger.serve();
    }
}

// --- Concrete Products ---
class BeefBurger implements Burger {
    public void prepare() { System.out.println("Preparing beef patty"); }
    public void cook() { System.out.println("Grilling beef patty"); }
    public String serve() { return "Beef burger served"; }
}

class ChickenBurger implements Burger {
    public void prepare() { System.out.println("Preparing chicken patty"); }
    public void cook() { System.out.println("Frying chicken patty"); }
    public String serve() { return "Chicken burger served"; }
}

// --- Concrete Factories ---
class BeefBurgerFactory implements BurgerFactory {
    public Burger createBurger() { return new BeefBurger(); }
}

class ChickenBurgerFactory implements BurgerFactory {
    public Burger createBurger() { return new ChickenBurger(); }
}

// Usage:
Kitchen kitchen = new Kitchen(new BeefBurgerFactory());
System.out.println(kitchen.prepareOrder());`
    },
    changes: 'The key change is that Kitchen no longer instantiates burgers directly. It receives a BurgerFactory and calls createBurger(), which returns a Burger. Adding a new burger type now only requires adding a new concrete product class and a new concrete factory — Kitchen stays untouched. The Open/Closed Principle is satisfied: the system is open for extension (new burger types) but closed for modification (Kitchen code).'
  },
  whyUsed: [
    'Encapsulates object creation — clients don\'t need to know which concrete class is being instantiated, only that it implements the expected interface.',
    'Supports the Open/Closed Principle — adding new product types requires adding new factory classes, not modifying existing code.',
    'Eliminates conditional instantiation logic scattered throughout the codebase, centralizing creation decisions in the factory hierarchy.',
    'Enables dependency injection — the factory can be swapped at runtime to change the entire family of objects the system produces.',
    'Supports Single Responsibility Principle by separating the concern of "how to create objects" from "how to use objects."'
  ],
  realWorldExamples: [
    'Java\'s javax.xml.parsers.DocumentBuilderFactory provides a factory method newDocumentBuilder() that returns a DocumentBuilder instance — the concrete implementation depends on the runtime configuration without the caller knowing.',
    'Python\'s datetime module uses factory-like construction: datetime.now() returns a datetime object configured for the current moment, abstracting away how the system clock is read.',
    'React\'s createElement() function acts as a factory — it returns a React element object of the specified type, hiding the underlying object structure from the developer.',
    'Django\'s model form factories (modelform_factory) generate Form classes dynamically based on a Model class, abstracting away the boilerplate of field definition.'
  ],
  dos: [
    'Use Factory Method when a class can\'t anticipate the class of objects it must create — delegate the decision to a factory.',
    'Design the factory interface and product interface to be stable — factories are most valuable when new products can be added without changing existing code.',
    'Keep factories focused — one factory type per product family, not a single god factory that creates everything.',
    'Prefer factory parameters that select a variant (e.g., a string or enum) inside the factory rather than exposing the concrete class selection to the caller.'
  ],
  donts: [
    'Don\'t use Factory Method when the object creation is simple and unlikely to change — it adds unnecessary indirection.',
    'Don\'t put business logic in factories — their job is object creation, not validation, caching, or other concerns.',
    'Don\'t create a factory for every class — reserve factories for situations where creation is complex, conditional, or likely to vary.',
    'Don\'t make the factory itself a singleton unless you genuinely need exactly one instance of it (see Singleton pattern — and even then, think twice).'
  ],
  relatedPatterns: [
    {
      name: 'Builder',
      slug: 'builder',
      distinction: 'Factory Method creates an object in one step (calling createBurger() returns a fully constructed object), while Builder constructs an object step by step, allowing different configurations. If you need to assemble burgers with optional ingredients, you want Builder, not Factory.'
    }
  ],
  interactiveType: 'dropdown'
};
