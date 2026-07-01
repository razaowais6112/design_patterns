import type { PatternData } from '../types';

export const singleton: PatternData = {
  id: 'singleton',
  name: 'Singleton',
  slug: 'singleton',
  category: {
    id: 'creational',
    name: 'Creational',
    slug: '/creational',
    description: 'Concerned with how objects are created.'
  },
  order: 3,
  intent: 'Ensure a class has only one instance and provide a global point of access to it.',
  problem: {
    narrative: `Your burger restaurant needs a central OrderNumberGenerator that hands out unique, sequential order numbers. Without Singleton, multiple parts of the system — the cash register, the online ordering system, the kiosk — might create their own instances of the generator. Each instance would start its own sequence, resulting in duplicate order numbers or conflicting IDs. Customers would receive order #42 from the register while the kitchen sees the same order as #1 from the kiosk — chaos.`,
    code: {
      python: `class OrderNumberGenerator:
    def __init__(self):
        self._counter = 0

    def next_number(self) -> int:
        self._counter += 1
        return self._counter

# Problem: each caller creates its own generator
class Register:
    def __init__(self):
        self.generator = OrderNumberGenerator()  # Gets its own sequence!

    def take_order(self):
        order_num = self.generator.next_number()
        print(f"Register: Order #{order_num}")

class Kiosk:
    def __init__(self):
        self.generator = OrderNumberGenerator()  # Gets its own sequence!

    def take_order(self):
        order_num = self.generator.next_number()
        print(f"Kiosk: Order #{order_num}")

# Register prints Order #1, Kiosk also prints Order #1 — collision!
register = Register()
kiosk = Kiosk()
register.take_order()  # Order #1
kiosk.take_order()     # Also Order #1 — should be #2`,
      javascript: `class OrderNumberGenerator {
  constructor() {
    this._counter = 0;
  }

  nextNumber() {
    this._counter++;
    return this._counter;
  }
}

// Problem: each caller creates its own generator
class Register {
  constructor() {
    this.generator = new OrderNumberGenerator();  // Gets its own sequence!
  }

  takeOrder() {
    const orderNum = this.generator.nextNumber();
    console.log("Register: Order #" + orderNum);
  }
}

class Kiosk {
  constructor() {
    this.generator = new OrderNumberGenerator();  // Gets its own sequence!
  }

  takeOrder() {
    const orderNum = this.generator.nextNumber();
    console.log("Kiosk: Order #" + orderNum);
  }
}

// Register prints Order #1, Kiosk also prints Order #1 — collision!
const register = new Register();
const kiosk = new Kiosk();
register.takeOrder();  // Order #1
kiosk.takeOrder();     // Also Order #1 — should be #2`,
      java: `class OrderNumberGenerator {
    private int counter = 0;

    public int nextNumber() {
        counter++;
        return counter;
    }
}

// Problem: each caller creates its own generator
class Register {
    private OrderNumberGenerator generator = new OrderNumberGenerator();

    public void takeOrder() {
        int orderNum = generator.nextNumber();
        System.out.println("Register: Order #" + orderNum);
    }
}

class Kiosk {
    private OrderNumberGenerator generator = new OrderNumberGenerator();

    public void takeOrder() {
        int orderNum = generator.nextNumber();
        System.out.println("Kiosk: Order #" + orderNum);
    }
}

// Register prints Order #1, Kiosk also prints Order #1 — collision!
Register register = new Register();
Kiosk kiosk = new Kiosk();
register.takeOrder();  // Order #1
kiosk.takeOrder();     // Also Order #1 — should be #2`
    },
    painPoints: [
      'Multiple instances of OrderNumberGenerator produce overlapping sequences, causing duplicate order numbers across different order entry points.',
      'No central coordination — every part of the system that needs a unique number has to either share a reference (fragile) or risk creating its own instance.',
      'Passing a single generator instance everywhere violates the Law of Demeter — distant parts of the system must receive the generator as a parameter through many layers.',
      'Testing becomes harder — different tests might create their own generators, interfering with each other\'s sequence state.'
    ]
  },
  solution: {
    narrative: `We make OrderNumberGenerator a Singleton: the constructor is private (or otherwise inaccessible), and a static getInstance() method returns the one and only instance. Now the register, kiosk, and online system all reference the same instance and share the same sequence. No duplicate numbers, no passing references through layers.`,
    code: {
      python: `class OrderNumberGenerator:
    _instance = None  # Class-level — holds the single instance

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._counter = 0  # Initialize only once
        return cls._instance  # Always return the same instance

    def next_number(self) -> int:
        self._counter += 1
        return self._counter

# Both Register and Kiosk get the SAME instance
class Register:
    def take_order(self):
        gen = OrderNumberGenerator()  # Returns the singleton!
        order_num = gen.next_number()
        print(f"Register: Order #{order_num}")

class Kiosk:
    def take_order(self):
        gen = OrderNumberGenerator()  # Returns the same singleton!
        order_num = gen.next_number()
        print(f"Kiosk: Order #{order_num}")

register = Register()
kiosk = Kiosk()
register.take_order()  # Order #1
kiosk.take_order()     # Order #2 — correct, shared sequence!`,
      javascript: `class OrderNumberGenerator {
  static _instance = null;  // Class-level — holds the single instance

  constructor() {
    if (OrderNumberGenerator._instance) {
      return OrderNumberGenerator._instance;  // Return existing instance
    }
    this._counter = 0;
    OrderNumberGenerator._instance = this;
  }

  static getInstance() {
    if (!OrderNumberGenerator._instance) {
      OrderNumberGenerator._instance = new OrderNumberGenerator();
    }
    return OrderNumberGenerator._instance;
  }

  nextNumber() {
    this._counter++;
    return this._counter;
  }
}

// Both Register and Kiosk get the SAME instance
class Register {
  takeOrder() {
    const gen = OrderNumberGenerator.getInstance();
    const orderNum = gen.nextNumber();
    console.log("Register: Order #" + orderNum);
  }
}

class Kiosk {
  takeOrder() {
    const gen = OrderNumberGenerator.getInstance();
    const orderNum = gen.nextNumber();
    console.log("Kiosk: Order #" + orderNum);
  }
}

const register = new Register();
const kiosk = new Kiosk();
register.takeOrder();  // Order #1
kiosk.takeOrder();     // Order #2 — correct, shared sequence!`,
      java: `class OrderNumberGenerator {
    private static OrderNumberGenerator instance = null;  // The single instance
    private int counter = 0;

    // Private constructor — nobody can instantiate directly
    private OrderNumberGenerator() {}

    // Global access point
    public static synchronized OrderNumberGenerator getInstance() {
        if (instance == null) {
            instance = new OrderNumberGenerator();
        }
        return instance;
    }

    public synchronized int nextNumber() {
        counter++;
        return counter;
    }
}

// Both Register and Kiosk get the SAME instance
class Register {
    public void takeOrder() {
        OrderNumberGenerator gen = OrderNumberGenerator.getInstance();
        int orderNum = gen.nextNumber();
        System.out.println("Register: Order #" + orderNum);
    }
}

class Kiosk {
    public void takeOrder() {
        OrderNumberGenerator gen = OrderNumberGenerator.getInstance();
        int orderNum = gen.nextNumber();
        System.out.println("Kiosk: Order #" + orderNum);
    }
}

Register register = new Register();
Kiosk kiosk = new Kiosk();
register.takeOrder();  // Order #1
kiosk.takeOrder();     // Order #2 — correct, shared sequence!`
    },
    changes: 'The constructor is made private (or controlled via __new__ in Python), and a static getInstance() method controls access to the single instance. The first call creates the instance; subsequent calls return the existing one. Now every part of the system shares the same counter, guaranteeing unique, sequential order numbers across all order entry points.'
  },
  whyUsed: [
    'Guarantees a single instance — critical for shared resources like configuration, connection pools, or sequence generators.',
    'Provides a well-known global access point — no need to pass the instance through layers of the system.',
    'Lazy initialization — the instance is only created when first needed, avoiding upfront resource allocation.',
    'Controls access to a shared resource — the Singleton can add synchronization to prevent race conditions on the shared state.'
  ],
  realWorldExamples: [
    'Java\'s Runtime.getRuntime() is a Singleton — there can only be one JVM runtime environment per process, and this method returns the unique instance.',
    'Python\'s logging.getLogger() returns named logger instances, but root logger access is controlled through a shared manager that behaves as a Singleton.',
    'Node.js module caching — when a module is required, Node caches it and returns the same exports object on subsequent requires, effectively creating Singletons at the module level.',
    'Database connection pools in most frameworks use a singleton pattern to ensure a single pool serves the entire application rather than creating multiple independent pools.'
  ],
  dos: [
    'Use Singleton for genuinely single-instance resources — configuration managers, thread pools, connection pools, sequence generators.',
    'Make Singletons thread-safe — if the Singleton holds mutable state accessed from multiple threads, synchronize access (or use eager initialization to avoid the problem entirely).',
    'Consider dependency injection as an alternative — pass the single instance explicitly rather than using a global access point, which makes testing easier.',
    'Keep Singleton initialization simple and fast — a Singleton that does heavy I/O or computation in its constructor can cause surprising startup delays.'
  ],
  donts: [
    'Don\'t use Singleton to hide global state — a Singleton is still global state, and excessive global state makes code hard to reason about and test.',
    'Don\'t make everything a Singleton just because you think you only need one — you might need more later (think of a multi-tenant system needing one connection pool per tenant).',
    'Don\'t put the Singleton in the hot path of a performance-critical section without considering synchronization overhead — each getInstance() call has a cost.',
    'Don\'t use Singleton when a simple static class (static methods only) would suffice — if the class has no instance state, you don\'t need a Singleton.'
  ],
  relatedPatterns: [
    {
      name: 'Factory Method',
      slug: 'factory',
      distinction: 'A Factory often returns a new instance each time create() is called, while a Singleton returns the same instance every time. Some factories are themselves Singletons (since you usually only need one factory), but the intent and the return behavior are different.'
    }
  ],
  interactiveType: 'diagram-only'
};
