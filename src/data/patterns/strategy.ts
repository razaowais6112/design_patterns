import type { PatternData } from '../types';

export const strategy: PatternData = {
  id: 'strategy',
  name: 'Strategy',
  slug: 'strategy',
  category: {
    id: 'behavioral',
    name: 'Behavioral',
    slug: '/behavioral',
    description: 'Concerned with how objects communicate and behave.'
  },
  order: 8,
  intent: 'Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from the clients that use it.',
  problem: {
    narrative: `Your burger restaurant needs to calculate the price of an order differently depending on the situation. Regular customers get no discount, loyalty members get 10% off, employees get 20% off, and lunch special orders get a fixed $2 discount. Currently, the Order class has a calculatePrice() method with a long chain of if/elif/else to check the customer type and apply the right discount. Every time a new discount strategy is introduced (like "Student discount: 15% off with ID"), you have to modify the Order class and add another conditional branch.`,
    code: {
      python: `class Order:
    def __init__(self, items, customer_type):
        self.items = items  # list of (name, price) tuples
        self.customer_type = customer_type

    def calculate_price(self) -> float:
        subtotal = sum(price for _, price in self.items)

        # Chain of conditionals — grows with every new discount type
        if self.customer_type == "regular":
            return subtotal
        elif self.customer_type == "loyalty":
            return subtotal * 0.9  # 10% off
        elif self.customer_type == "employee":
            return subtotal * 0.8  # 20% off
        elif self.customer_type == "lunch_special":
            return subtotal - 2.0  # $2 off
        elif self.customer_type == "student":
            return subtotal * 0.85  # 15% off — added another branch!
        else:
            return subtotal`,
      javascript: `class Order {
  constructor(items, customerType) {
    this.items = items;  // Array of {name, price}
    this.customerType = customerType;
  }

  calculatePrice() {
    const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);

    // Chain of conditionals — grows with every new discount type
    if (this.customerType === "regular") return subtotal;
    if (this.customerType === "loyalty") return subtotal * 0.9;
    if (this.customerType === "employee") return subtotal * 0.8;
    if (this.customerType === "lunch_special") return subtotal - 2.0;
    if (this.customerType === "student") return subtotal * 0.85;
    return subtotal;
  }
}`,
      java: `class Order {
    private List<Item> items;
    private String customerType;

    Order(List<Item> items, String customerType) {
        this.items = items;
        this.customerType = customerType;
    }

    double calculatePrice() {
        double subtotal = items.stream().mapToDouble(i -> i.price).sum();

        // Chain of conditionals — grows with every new discount type
        if (customerType.equals("regular")) return subtotal;
        if (customerType.equals("loyalty")) return subtotal * 0.9;
        if (customerType.equals("employee")) return subtotal * 0.8;
        if (customerType.equals("lunch_special")) return subtotal - 2.0;
        if (customerType.equals("student")) return subtotal * 0.85;
        return subtotal;
    }
}`
    },
    painPoints: [
      'Violates Open/Closed Principle — adding a new discount type requires modifying the Order class, adding risk to existing discount logic.',
      'Large conditional chains are hard to read, test, and maintain — as more discount types are added, the method grows uncontrollably.',
      'Discount logic is mixed with order business logic — the Order class knows about every pricing rule in the business.',
      'Cannot compose or change discount strategies dynamically — a customer might qualify for both loyalty AND lunch special discounts, but the current code picks only one.'
    ]
  },
  solution: {
    narrative: `We extract each discount algorithm into its own class that implements a common PricingStrategy interface. The Order class receives a PricingStrategy and delegates price calculation to it. New discount types mean new strategy classes, not changes to Order. Strategies can even be composed (e.g., a loyalty customer ordering during lunch gets both discounts applied in sequence).`,
    code: {
      python: `from abc import ABC, abstractmethod

# Strategy interface — each discount algorithm implements this
class PricingStrategy(ABC):
    @abstractmethod
    def calculate(self, subtotal: float) -> float:
        pass

class RegularPricing(PricingStrategy):
    def calculate(self, subtotal: float) -> float:
        return subtotal

class LoyaltyPricing(PricingStrategy):
    def calculate(self, subtotal: float) -> float:
        return subtotal * 0.9  # 10% off

class EmployeePricing(PricingStrategy):
    def calculate(self, subtotal: float) -> float:
        return subtotal * 0.8  # 20% off

class LunchSpecialPricing(PricingStrategy):
    def calculate(self, subtotal: float) -> float:
        return subtotal - 2.0  # $2 off

# New strategy — no changes to Order needed!
class StudentPricing(PricingStrategy):
    def calculate(self, subtotal: float) -> float:
        return subtotal * 0.85

# The Strategy can be swapped at runtime or composed
class CompositePricing(PricingStrategy):
    """Applies multiple strategies in sequence."""
    def __init__(self, strategies: list[PricingStrategy]):
        self.strategies = strategies
    def calculate(self, subtotal: float) -> float:
        result = subtotal
        for s in self.strategies:
            result = s.calculate(result)
        return result

class Order:
    def __init__(self, items, pricing: PricingStrategy):
        self.items = items
        self.pricing = pricing  # Strategy injected — Order doesn't care which

    def calculate_price(self) -> float:
        subtotal = sum(price for _, price in self.items)
        return self.pricing.calculate(subtotal)

# Usage — strategy is selected at runtime
order = Order([("Burger", 7.99), ("Fries", 2.99)], EmployeePricing())
print(order.calculate_price())  # 20% off

# Composing strategies
lunch_loyalty = CompositePricing([LoyaltyPricing(), LunchSpecialPricing()])
order2 = Order([("Burger", 7.99)], lunch_loyalty)
print(order2.calculate_price())  # 10% off, then another $2 off`,
      javascript: `// Strategy interface
class PricingStrategy {
  calculate(subtotal) { throw new Error("Abstract method"); }
}

class RegularPricing extends PricingStrategy {
  calculate(subtotal) { return subtotal; }
}

class LoyaltyPricing extends PricingStrategy {
  calculate(subtotal) { return subtotal * 0.9; }
}

class EmployeePricing extends PricingStrategy {
  calculate(subtotal) { return subtotal * 0.8; }
}

class LunchSpecialPricing extends PricingStrategy {
  calculate(subtotal) { return subtotal - 2.0; }
}

class StudentPricing extends PricingStrategy {
  calculate(subtotal) { return subtotal * 0.85; }
}

class Order {
  constructor(items, pricing) {
    this.items = items;
    this.pricing = pricing;  // Strategy injected
  }

  calculatePrice() {
    const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
    return this.pricing.calculate(subtotal);
  }
}

// Usage
const order = new Order(
  [{name: "Burger", price: 7.99}, {name: "Fries", price: 2.99}],
  new EmployeePricing()
);
console.log(order.calculatePrice());`,
      java: `// Strategy interface
interface PricingStrategy {
    double calculate(double subtotal);
}

class RegularPricing implements PricingStrategy {
    public double calculate(double subtotal) { return subtotal; }
}

class LoyaltyPricing implements PricingStrategy {
    public double calculate(double subtotal) { return subtotal * 0.9; }
}

class EmployeePricing implements PricingStrategy {
    public double calculate(double subtotal) { return subtotal * 0.8; }
}

class LunchSpecialPricing implements PricingStrategy {
    public double calculate(double subtotal) { return subtotal - 2.0; }
}

class StudentPricing implements PricingStrategy {
    public double calculate(double subtotal) { return subtotal * 0.85; }
}

class Order {
    private List<Item> items;
    private PricingStrategy pricing;  // Strategy injected

    Order(List<Item> items, PricingStrategy pricing) {
        this.items = items;
        this.pricing = pricing;
    }

    double calculatePrice() {
        double subtotal = items.stream().mapToDouble(i -> i.price).sum();
        return pricing.calculate(subtotal);
    }
}

// Usage — strategy is selected at runtime
Order order = new Order(
    Arrays.asList(new Item("Burger", 7.99), new Item("Fries", 2.99)),
    new EmployeePricing()
);
System.out.println(order.calculatePrice());`
    },
    changes: 'The discount logic is extracted into separate PricingStrategy classes. Order receives a strategy via its constructor and delegates calculate() to it. New discount types don\'t require changes to Order — just add a new class. Strategies can be swapped at runtime, combined, or tested independently of Order.'
  },
  whyUsed: [
    'Supports Open/Closed Principle — new algorithms are added as new strategy classes, without modifying existing context classes.',
    'Eliminates complex conditional statements — each algorithm is isolated in its own class instead of being a branch in a long if/else chain.',
    'Enables swapping algorithms at runtime — the strategy can change based on configuration, user role, or even time of day.',
    'Improves testability — each strategy can be unit tested independently without needing to instantiate the context.',
    'Supports Single Responsibility Principle — the context handles its core job, and each strategy handles one specific algorithm.'
  ],
  realWorldExamples: [
    'Java\'s Comparator<T> interface is a Strategy — sorting algorithms use a compare() strategy to determine element ordering, and different comparators can be plugged into the same sort method.',
    'Python\'s sorted() function accepts a key argument that acts as a strategy — the key function extracts a comparison value, and different key functions produce different sort orders without changing the sorting algorithm.',
    'Express.js/Node.js middleware functions are Strategies — each middleware handles a specific aspect of request processing (logging, auth, parsing), and they\'re composed into a pipeline.',
    'Payment processing systems use Strategy — a Checkout class might accept different PaymentStrategy implementations (CreditCard, PayPal, Crypto) without knowing the details of each payment method.'
  ],
  dos: [
    'Use Strategy when you have multiple related algorithms or behaviors that differ only in their implementation.',
    'Keep the strategy interface focused — a single method that takes the necessary input and returns the result is usually sufficient.',
    'Make strategies stateless whenever possible — if a strategy doesn\'t hold state, the same instance can be shared across many clients.',
    'Consider factory methods to select the right strategy based on configuration — don\'t let the client guess which strategy to use.'
  ],
  donts: [
    'Don\'t use Strategy for a single algorithm that never changes — the indirection adds no value.',
    'Don\'t let strategies know about the context — a strategy should receive its input and return its output; it shouldn\'t call back into the context.',
    'Don\'t create too many strategy classes — if you have dozens of strategies, consider a more data-driven approach (e.g., configuration-based rules).',
    'Don\'t confuse Strategy with State — Strategy is about interchangeable algorithms; State is about changing behavior based on internal state (see State pattern).'
  ],
  relatedPatterns: [
    {
      name: 'State',
      slug: 'state',
      distinction: 'Strategy lets you swap algorithms that are selected by the client and act independently. State lets an object change its behavior when its internal state changes — the state transitions are managed by the state objects themselves, not the client. Strategy says "I choose how to calculate"; State says "My current status determines how I behave."'
    }
  ],
  interactiveType: 'dropdown'
};
