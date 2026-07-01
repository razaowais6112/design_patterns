import type { PatternData } from '../types';

export const adapter: PatternData = {
  id: 'adapter',
  name: 'Adapter',
  slug: 'adapter',
  category: {
    id: 'structural',
    name: 'Structural',
    slug: '/structural',
    description: 'Concerned with how objects/classes are composed together.'
  },
  order: 4,
  intent: 'Convert the interface of a class into another interface that clients expect. Adapter lets classes work together that couldn\'t otherwise because of incompatible interfaces.',
  problem: {
    narrative: `Your restaurant's payment system expects a PaymentProcessor interface that processes payments and returns a receipt string. You've integrated a local bank's payment API that fits nicely. But now management wants to accept payments through a third-party service, "QuickPay," which has a completely different API: it uses makePayment() instead of processPayment(), returns an integer code instead of a string, and requires a merchant ID. You can't change QuickPay's library, and you can't change your system's PaymentProcessor interface without breaking existing integrations.`,
    code: {
      python: `class PaymentProcessor:
    """Interface our restaurant expects."""
    def process(self, amount: float) -> str:
        pass

class BankPaymentProcessor(PaymentProcessor):
    def process(self, amount: float) -> str:
        return f"Bank payment of \${amount} approved — receipt #1234"

# Third-party API with incompatible interface
class QuickPayAPI:
    """We CAN'T modify this — it's an external library."""
    def make_payment(self, amount: float, merchant_id: str) -> int:
        print(f"QuickPay processing \${amount} for merchant {merchant_id}")
        return 200  # Status code, not a receipt string

class Restaurant:
    def __init__(self, processor: PaymentProcessor):
        self.processor = processor

    def charge_customer(self, amount: float):
        result = self.processor.process(amount)
        print(f"Payment result: {result}")

# This works:
restaurant = Restaurant(BankPaymentProcessor())
restaurant.charge_customer(25.50)

# This DOESN'T work — QuickPayAPI doesn't implement PaymentProcessor:
# restaurant = Restaurant(QuickPayAPI())  # TypeError!`,
      javascript: `class PaymentProcessor {
  // Interface our restaurant expects
  process(amount) { throw new Error("Abstract method"); }
}

class BankPaymentProcessor extends PaymentProcessor {
  process(amount) {
    return "Bank payment of $" + amount + " approved — receipt #1234";
  }
}

// Third-party API with incompatible interface
class QuickPayAPI {
  // We CAN'T modify this — it's an external library
  makePayment(amount, merchantId) {
    console.log("QuickPay processing $" + amount + " for merchant " + merchantId);
    return 200;  // Status code, not a receipt string
  }
}

class Restaurant {
  constructor(processor) {
    this.processor = processor;
  }

  chargeCustomer(amount) {
    const result = this.processor.process(amount);
    console.log("Payment result:", result);
  }
}

// This works:
const restaurant = new Restaurant(new BankPaymentProcessor());
restaurant.chargeCustomer(25.50);

// This DOESN'T work:
// const restaurant = new Restaurant(new QuickPayAPI()); // No process() method!`,
      java: `interface PaymentProcessor {
    String process(double amount);
}

class BankPaymentProcessor implements PaymentProcessor {
    public String process(double amount) {
        return "Bank payment of $" + amount + " approved — receipt #1234";
    }
}

// Third-party API with incompatible interface
class QuickPayAPI {
    // We CAN'T modify this — it's an external library
    public int makePayment(double amount, String merchantId) {
        System.out.println("QuickPay processing $" + amount + " for merchant " + merchantId);
        return 200;  // Status code, not a receipt string
    }
}

class Restaurant {
    private PaymentProcessor processor;

    public Restaurant(PaymentProcessor processor) {
        this.processor = processor;
    }

    public void chargeCustomer(double amount) {
        String result = processor.process(amount);
        System.out.println("Payment result: " + result);
    }
}

// This works:
Restaurant r = new Restaurant(new BankPaymentProcessor());
r.chargeCustomer(25.50);

// This DOESN'T work:
// Restaurant r = new Restaurant(new QuickPayAPI()); // Incompatible types!`
    },
    painPoints: [
      'QuickPayAPI has a different method name (makePayment vs process), different return type (int vs String), and an extra parameter (merchantId) — completely incompatible with your system\'s PaymentProcessor interface.',
      'You can\'t modify QuickPayAPI — it\'s an external library controlled by a third party.',
      'You can\'t change your system\'s PaymentProcessor interface — existing integrations (like BankPaymentProcessor) depend on it.',
      'Hardcoding QuickPay-specific logic in Restaurant would violate Open/Closed Principle and couple your core business logic to a specific vendor\'s API.'
    ]
  },
  solution: {
    narrative: `We create a QuickPayAdapter that implements PaymentProcessor (the interface Restaurant expects) but internally delegates to QuickPayAPI. The adapter translates the process(amount) call into makePayment(amount, merchantId) and converts the integer response into a receipt string. Restaurant never knows it's talking to QuickPay — it sees a familiar PaymentProcessor.`,
    code: {
      python: `class PaymentProcessor:
    """Interface our restaurant expects."""
    def process(self, amount: float) -> str:
        pass

class BankPaymentProcessor(PaymentProcessor):
    def process(self, amount: float) -> str:
        return f"Bank payment of \${amount} approved — receipt #1234"

# Third-party API — unchanged
class QuickPayAPI:
    def make_payment(self, amount: float, merchant_id: str) -> int:
        print(f"QuickPay processing \${amount} for merchant {merchant_id}")
        return 200

# The Adapter — implements the expected interface, wraps the incompatible one
class QuickPayAdapter(PaymentProcessor):
    def __init__(self, merchant_id: str):
        self.api = QuickPayAPI()
        self.merchant_id = merchant_id

    def process(self, amount: float) -> str:
        # Translate the call from process() to make_payment()
        status_code = self.api.make_payment(amount, self.merchant_id)
        # Translate the response from int to string
        return f"QuickPay payment of \${amount} approved (code {status_code})"

class Restaurant:
    def __init__(self, processor: PaymentProcessor):
        self.processor = processor

    def charge_customer(self, amount: float):
        result = self.processor.process(amount)
        print(f"Payment result: {result}")

# Restaurant uses the adapter — no code changes needed!
restaurant = Restaurant(QuickPayAdapter("MERCHANT_001"))
restaurant.charge_customer(25.50)`,
      javascript: `class PaymentProcessor {
  process(amount) { throw new Error("Abstract method"); }
}

class BankPaymentProcessor extends PaymentProcessor {
  process(amount) {
    return "Bank payment of $" + amount + " approved — receipt #1234";
  }
}

class QuickPayAPI {
  makePayment(amount, merchantId) {
    console.log("QuickPay processing $" + amount + " for merchant " + merchantId);
    return 200;
  }
}

// The Adapter — implements the expected interface, wraps the incompatible one
class QuickPayAdapter extends PaymentProcessor {
  constructor(merchantId) {
    super();
    this.api = new QuickPayAPI();
    this.merchantId = merchantId;
  }

  process(amount) {
    // Translate the call from process() to makePayment()
    const statusCode = this.api.makePayment(amount, this.merchantId);
    // Translate the response from int to string
    return "QuickPay payment of $" + amount + " approved (code " + statusCode + ")";
  }
}

class Restaurant {
  constructor(processor) {
    this.processor = processor;
  }

  chargeCustomer(amount) {
    const result = this.processor.process(amount);
    console.log("Payment result:", result);
  }
}

// Restaurant uses the adapter — no code changes needed!
const restaurant = new Restaurant(new QuickPayAdapter("MERCHANT_001"));
restaurant.chargeCustomer(25.50);`,
      java: `interface PaymentProcessor {
    String process(double amount);
}

class BankPaymentProcessor implements PaymentProcessor {
    public String process(double amount) {
        return "Bank payment of $" + amount + " approved — receipt #1234";
    }
}

class QuickPayAPI {
    public int makePayment(double amount, String merchantId) {
        System.out.println("QuickPay processing $" + amount + " for merchant " + merchantId);
        return 200;
    }
}

// The Adapter — implements the expected interface, wraps the incompatible one
class QuickPayAdapter implements PaymentProcessor {
    private QuickPayAPI api = new QuickPayAPI();
    private String merchantId;

    public QuickPayAdapter(String merchantId) {
        this.merchantId = merchantId;
    }

    @Override
    public String process(double amount) {
        // Translate the call from process() to makePayment()
        int statusCode = api.makePayment(amount, merchantId);
        // Translate the response from int to string
        return "QuickPay payment of $" + amount + " approved (code " + statusCode + ")";
    }
}

class Restaurant {
    private PaymentProcessor processor;

    public Restaurant(PaymentProcessor processor) {
        this.processor = processor;
    }

    public void chargeCustomer(double amount) {
        String result = processor.process(amount);
        System.out.println("Payment result: " + result);
    }
}

// Restaurant uses the adapter — no code changes needed!
Restaurant r = new Restaurant(new QuickPayAdapter("MERCHANT_001"));
r.chargeCustomer(25.50);`
    },
    changes: 'The QuickPayAdapter wraps QuickPayAPI and implements PaymentProcessor. It translates the process(amount) method into makePayment(amount, merchantId) and converts the integer response code into a receipt string. Restaurant and all existing code remain unchanged — they continue talking to PaymentProcessor. Adding a new payment provider requires only a new adapter class, not changes to Restaurant.'
  },
  whyUsed: [
    'Enables integration between components with incompatible interfaces without modifying either side — saves you when dealing with third-party or legacy code.',
    'Supports Single Responsibility Principle — the adapter\'s only job is interface translation, keeping it separate from business logic.',
    'Supports Open/Closed Principle — new integrations are added as new adapter classes, not by modifying existing code.',
    'Provides a clean boundary between your system and external dependencies — if the external API changes, only the adapter changes.'
  ],
  realWorldExamples: [
    'Java\'s java.util.Arrays.asList() adapts an array (a different data structure) to the List interface so it can be used with collection-based code.',
    'React Native\'s NativeModules bridge adapts native platform APIs (Java on Android, Objective-C on iOS) into a unified JavaScript-friendly interface.',
    'Python\'s io.TextIOWrapper adapts a BufferedIOBase (binary stream) into a TextIOBase (text stream), translating between bytes and strings transparently.',
    'JDBC (Java Database Connectivity) acts as an adapter layer — your application talks to the JDBC interface, and the specific JDBC driver adapts that to MySQL, PostgreSQL, or Oracle\'s native protocols.'
  ],
  dos: [
    'Use Adapter when you need to integrate a class whose interface doesn\'t match what your system expects, and you can\'t (or shouldn\'t) modify either side.',
    'Keep the adapter thin — it should only translate interface calls. Don\'t put business logic, validation, or caching in the adapter.',
    'Prefer Object Adapter (composition) over Class Adapter (inheritance) when possible — it\'s more flexible since it adapts any instance, not just a specific class.',
    'Document what the adapter translates — future maintainers need to know which interface methods map to which adapted methods.'
  ],
  donts: [
    'Don\'t use an Adapter when you can modify the target interface — if you control both sides, just change one to match the other.',
    'Don\'t stack adapters — an adapter wrapping an adapter wrapping an adapter is a debugging nightmare.',
    'Don\'t put complex logic in the adapter — if you\'re doing more than interface translation, you\'re violating Single Responsibility.',
    'Don\'t use Adapter when a Facade would be more appropriate — if the issue is a complex subsystem, not an incompatible interface, use Facade (see Facade pattern).'
  ],
  relatedPatterns: [
    {
      name: 'Facade',
      slug: 'facade',
      distinction: 'Adapter is about making an incompatible interface work with your system (interface conversion). Facade is about simplifying a complex subsystem (interface simplification). A QuickPay adapter translates the call format; a payment Facade might hide whether you\'re using QuickPay, bank transfer, or cash under a simple chargeCustomer() method.'
    }
  ],
  interactiveType: 'toggle'
};
