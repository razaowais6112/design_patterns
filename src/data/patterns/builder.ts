import type { PatternData } from '../types';

export const builder: PatternData = {
  id: 'builder',
  name: 'Builder',
  slug: 'builder',
  category: {
    id: 'creational',
    name: 'Creational',
    slug: '/creational',
    description: 'Concerned with how objects are created.'
  },
  order: 2,
  intent: 'Separate the construction of a complex object from its representation so that the same construction process can create different representations.',
  problem: {
    narrative: `Your burger restaurant now offers custom burgers. Customers can choose the patty type, bun style, cheese (optional), sauce, and toppings. Currently, the Burger class constructor takes 6+ parameters, including nullable ones for optional ingredients. As options grow, the constructor becomes an unreadable mess of positional arguments. Callers must remember the order of parameters and pass null for options they don't want. Adding a new option means adding another parameter to every place that constructs a Burger — even if most callers just want the default.`,
    code: {
      python: `class Burger:
    def __init__(self, patty, bun, cheese=None, sauce=None,
                 lettuce=False, tomato=False, onion=False,
                 pickles=False, ketchup=False, mustard=False,
                 special_sauce=False):
        self.patty = patty
        self.bun = bun
        self.cheese = cheese
        self.sauce = sauce
        self.lettuce = lettuce
        self.tomato = tomato
        self.onion = onion
        self.pickles = pickles
        self.ketchup = ketchup
        self.mustard = mustard
        self.special_sauce = special_sauce

# How orders look — hard to read and easy to get wrong
burger1 = Burger("beef", "brioche", "cheddar", None, True, True, False, False, True, False, False)
burger2 = Burger("chicken", "sesame", None, "bbq", False, True, True, True, False, True, False)`,
      javascript: `class Burger {
  constructor(patty, bun, cheese, sauce, lettuce, tomato,
              onion, pickles, ketchup, mustard, specialSauce) {
    this.patty = patty;
    this.bun = bun;
    this.cheese = cheese;
    this.sauce = sauce;
    this.lettuce = lettuce;
    this.tomato = tomato;
    this.onion = onion;
    this.pickles = pickles;
    this.ketchup = ketchup;
    this.mustard = mustard;
    this.specialSauce = specialSauce;
  }
}

// How orders look — hard to read and easy to get wrong
const burger1 = new Burger("beef", "brioche", "cheddar", null, true, true, false, false, true, false, false);
const burger2 = new Burger("chicken", "sesame", null, "bbq", false, true, true, true, false, true, false);`,
      java: `class Burger {
    private String patty;
    private String bun;
    private String cheese;
    private String sauce;
    private boolean lettuce;
    private boolean tomato;
    private boolean onion;
    private boolean pickles;
    private boolean ketchup;
    private boolean mustard;
    private boolean specialSauce;

    public Burger(String patty, String bun, String cheese, String sauce,
                  boolean lettuce, boolean tomato, boolean onion,
                  boolean pickles, boolean ketchup, boolean mustard,
                  boolean specialSauce) {
        this.patty = patty;
        this.bun = bun;
        this.cheese = cheese;
        this.sauce = sauce;
        this.lettuce = lettuce;
        this.tomato = tomato;
        this.onion = onion;
        this.pickles = pickles;
        this.ketchup = ketchup;
        this.mustard = mustard;
        this.specialSauce = specialSauce;
    }
}

// How orders look — hard to read and easy to get wrong
Burger burger1 = new Burger("beef", "brioche", "cheddar", null, true, true, false, false, true, false, false);
Burger burger2 = new Burger("chicken", "sesame", null, "bbq", false, true, true, true, false, true, false);`
    },
    painPoints: [
      'Telescoping constructors — adding a new optional parameter requires adding a new constructor overload or a new positional argument, breaking existing callers.',
      'Hard to read — callers must remember parameter order and meaning; a row of true/false/null values is opaque without careful documentation.',
      'Easy to misorder arguments — swapping two boolean flags or string parameters produces bugs that are hard to spot visually.',
      'No intermediate state — you can\'t construct a partially-built burger and pass it around; everything must be specified at once in the constructor.'
    ]
  },
  solution: {
    narrative: `We introduce a BurgerBuilder that separates the construction process from the final product. Instead of passing everything to the constructor, we call chained methods that each set one attribute, then call build() to produce the final Burger. The builder validates the state and ensures a consistent result, while the Burger class itself is kept clean with a private constructor or package-visible constructor.`,
    code: {
      python: `class Burger:
    def __init__(self):
        self.patty = None
        self.bun = None
        self.cheese = None
        self.sauce = None
        self.lettuce = False
        self.tomato = False
        self.onion = False
        self.pickles = False
        self.ketchup = False
        self.mustard = False
        self.special_sauce = False

    def __str__(self):
        toppings = []
        if self.lettuce: toppings.append("lettuce")
        if self.tomato: toppings.append("tomato")
        if self.onion: toppings.append("onion")
        return f"{self.patty} burger on {self.bun} with {', '.join(toppings)}"

class BurgerBuilder:
    def __init__(self):
        self.burger = Burger()  # Start with an empty burger

    def set_patty(self, patty: str):
        self.burger.patty = patty
        return self  # Return self to enable chaining

    def set_bun(self, bun: str):
        self.burger.bun = bun
        return self

    def add_cheese(self, cheese: str):
        self.burger.cheese = cheese
        return self

    def add_lettuce(self):
        self.burger.lettuce = True
        return self

    def add_tomato(self):
        self.burger.tomato = True
        return self

    def add_onion(self):
        self.burger.onion = True
        return self

    def build(self) -> Burger:
        # Validate before returning
        if not self.burger.patty or not self.burger.bun:
            raise ValueError("Burger must have at least a patty and a bun")
        return self.burger

# How orders look — clear and self-documenting
burger = (BurgerBuilder()
          .set_patty("beef")
          .set_bun("brioche")
          .add_cheese("cheddar")
          .add_lettuce()
          .add_tomato()
          .build())`,
      javascript: `class Burger {
  constructor() {
    this.patty = null;
    this.bun = null;
    this.cheese = null;
    this.sauce = null;
    this.lettuce = false;
    this.tomato = false;
    this.onion = false;
    this.pickles = false;
  }
}

class BurgerBuilder {
  constructor() {
    this.burger = new Burger();  // Start with an empty burger
  }

  setPatty(patty) {
    this.burger.patty = patty;
    return this;  // Return this to enable chaining
  }

  setBun(bun) {
    this.burger.bun = bun;
    return this;
  }

  addCheese(cheese) {
    this.burger.cheese = cheese;
    return this;
  }

  addLettuce() {
    this.burger.lettuce = true;
    return this;
  }

  addTomato() {
    this.burger.tomato = true;
    return this;
  }

  build() {
    if (!this.burger.patty || !this.burger.bun) {
      throw new Error("Burger must have at least a patty and a bun");
    }
    return this.burger;
  }
}

// How orders look — clear and self-documenting
const burger = new BurgerBuilder()
  .setPatty("beef")
  .setBun("brioche")
  .addCheese("cheddar")
  .addLettuce()
  .addTomato()
  .build();`,
      java: `class Burger {
    private String patty;
    private String bun;
    private String cheese;
    private String sauce;
    private boolean lettuce;
    private boolean tomato;

    // Package-private constructor — only the builder can call this
    Burger() {}

    // Getters omitted for brevity
    public String toString() {
        return patty + " burger on " + bun;
    }
}

class BurgerBuilder {
    private Burger burger = new Burger();  // Start with an empty burger

    public BurgerBuilder setPatty(String patty) {
        burger.patty = patty;
        return this;  // Return this to enable chaining
    }

    public BurgerBuilder setBun(String bun) {
        burger.bun = bun;
        return this;
    }

    public BurgerBuilder addCheese(String cheese) {
        burger.cheese = cheese;
        return this;
    }

    public BurgerBuilder addLettuce() {
        burger.lettuce = true;
        return this;
    }

    public BurgerBuilder addTomato() {
        burger.tomato = true;
        return this;
    }

    public Burger build() {
        if (burger.patty == null || burger.bun == null) {
            throw new IllegalStateException("Burger must have at least a patty and a bun");
        }
        return burger;
    }
}

// How orders look — clear and self-documenting
Burger burger = new BurgerBuilder()
    .setPatty("beef")
    .setBun("brioche")
    .addCheese("cheddar")
    .addLettuce()
    .addTomato()
    .build();`
    },
    changes: 'The Burger class no longer has a wide constructor — it\'s constructed step by step through the BurgerBuilder. Each builder method sets one property and returns this, enabling method chaining. The builder validates the burger\'s state in build() before returning it. Adding a new optional topping means adding one method to the builder and one field to Burger — no constructor signature changes, no breaking existing callers.'
  },
  whyUsed: [
    'Eliminates telescoping constructors — each optional parameter becomes a named method, not a constructor position.',
    'Self-documenting code — builder method calls read like English and clearly describe what\'s being built.',
    'Enables immutable objects — the constructed object can be made immutable after build(), since the builder handles all mutation during construction.',
    'Supports step-by-step construction with validation at each step — intermediate states are still valid, and the final build() call enforces invariants.',
    'The same construction process can produce different representations — a single BurgerBuilder can build a classic, deluxe, or kids meal burger.'
  ],
  realWorldExamples: [
    'Java\'s StringBuilder is a classic Builder — you call append() repeatedly and then toString() to get the final String, separating incremental construction from the immutable result.',
    'Lombok\'s @Builder annotation generates a builder class from any class definition, eliminating manual builder boilerplate in Java projects.',
    'JavaScript\'s jQuery chain relies on a builder-like pattern where each method call returns the jQuery object, enabling fluent chaining like $("div").addClass("active").css("color", "red").',
    'Kotlin\'s apply/also scope functions enable builder-like construction without a separate builder class — object.apply { property = value } and the object is ready.'
  ],
  dos: [
    'Use Builder when an object requires many (more than 3-4) optional parameters, especially when many are of the same type (multiple strings, multiple booleans).',
    'Validate in build() — check that required fields are set and the constructed object is in a valid state before returning it.',
    'Return this from setter methods to enable fluent chaining — it dramatically improves readability at the call site.',
    'Consider a Director object if you have common burger configurations (e.g., a "classic" burger with preset toppings) — the Director encapsulates the recipe.'
  ],
  donts: [
    'Don\'t use Builder for objects with 1-2 required parameters and no optional ones — a simple constructor or factory is cleaner.',
    'Don\'t mix Builder with inheritance hierarchies — builders don\'t compose well with subclasses; consider a different pattern for polymorphic construction.',
    'Don\'t put business logic in builder methods — they should set properties and validate, not compute things or query databases.',
    'Don\'t forget to validate in build() — a builder that returns an incomplete or invalid object defeats the purpose.'
  ],
  relatedPatterns: [
    {
      name: 'Factory Method',
      slug: 'factory',
      distinction: 'Factory Method creates an object in one call (createBurger() returns a fully-built burger). Builder constructs an object step by step with method chaining. If the construction is simple and doesn\'t vary, use Factory. If the construction has many optional parts, use Builder.'
    }
  ],
  interactiveType: 'step-through'
};
