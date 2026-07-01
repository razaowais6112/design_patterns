import type { PatternData } from '../types';

export const facade: PatternData = {
  id: 'facade',
  name: 'Facade',
  slug: 'facade',
  category: {
    id: 'structural',
    name: 'Structural',
    slug: '/structural',
    description: 'Concerned with how objects/classes are composed together.'
  },
  order: 5,
  intent: 'Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.',
  problem: {
    narrative: `When a customer places a takeout order at your burger restaurant, the kitchen staff must interact with multiple subsystems: the OrderSystem to register the order, the PaymentSystem to process payment, the InventorySystem to check stock and decrement ingredients, the NotificationSystem to alert the customer when ready, and the DeliverySystem if it's a delivery order. A staff member must correctly sequence calls to each of these. If any step is missed or done in the wrong order, the order fails. Every new staff member needs weeks of training on the full internal workflow.`,
    code: {
      python: `class OrderSystem:
    def create_order(self, items): return "Order #456 created"
class PaymentSystem:
    def charge(self, amount): return "Payment of $"+str(amount)+" approved"
class InventorySystem:
    def check_stock(self, items): return True
    def decrement(self, items): return "Stock updated"
class NotificationSystem:
    def send_confirmation(self, order_id): pass
    def send_ready_notification(self, order_id): pass
class DeliverySystem:
    def dispatch(self, order_id, address): return "Delivery dispatched"

# Staff must know and sequence every subsystem call correctly
def process_takeout_order(items, amount, address):
    order_sys = OrderSystem()
    pay_sys = PaymentSystem()
    inv_sys = InventorySystem()
    notif_sys = NotificationSystem()
    del_sys = DeliverySystem()

    # Lots of steps — easy to forget one or do them in wrong order
    if not inv_sys.check_stock(items):
        return "Out of stock!"
    order_result = order_sys.create_order(items)
    pay_result = pay_sys.charge(amount)
    inv_sys.decrement(items)
    notif_sys.send_confirmation("456")
    del_result = del_sys.dispatch("456", address)
    notif_sys.send_ready_notification("456")
    return f"Order complete: {order_result}, {pay_result}, {del_result}"`,
      javascript: `class OrderSystem {
  createOrder(items) { return "Order #456 created"; }
}
class PaymentSystem {
  charge(amount) { return "Payment of $" + amount + " approved"; }
}
class InventorySystem {
  checkStock(items) { return true; }
  decrement(items) { return "Stock updated"; }
}
class NotificationSystem {
  sendConfirmation(orderId) {}
  sendReadyNotification(orderId) {}
}
class DeliverySystem {
  dispatch(orderId, address) { return "Delivery dispatched"; }
}

// Staff must know and sequence every subsystem call correctly
function processTakeoutOrder(items, amount, address) {
  const orderSys = new OrderSystem();
  const paySys = new PaymentSystem();
  const invSys = new InventorySystem();
  const notifSys = new NotificationSystem();
  const delSys = new DeliverySystem();

  if (!invSys.checkStock(items)) return "Out of stock!";
  const orderResult = orderSys.createOrder(items);
  const payResult = paySys.charge(amount);
  invSys.decrement(items);
  notifSys.sendConfirmation("456");
  const delResult = delSys.dispatch("456", address);
  notifSys.sendReadyNotification("456");
  return "Order complete: " + orderResult + ", " + payResult + ", " + delResult;
}`,
      java: `class OrderSystem {
    String createOrder(List<String> items) { return "Order #456 created"; }
}
class PaymentSystem {
    String charge(double amount) { return "Payment of $" + amount + " approved"; }
}
class InventorySystem {
    boolean checkStock(List<String> items) { return true; }
    String decrement(List<String> items) { return "Stock updated"; }
}
class NotificationSystem {
    void sendConfirmation(String orderId) {}
    void sendReadyNotification(String orderId) {}
}
class DeliverySystem {
    String dispatch(String orderId, String address) { return "Delivery dispatched"; }
}

// Staff must know and sequence every subsystem call correctly
String processTakeoutOrder(List<String> items, double amount, String address) {
    OrderSystem orderSys = new OrderSystem();
    PaymentSystem paySys = new PaymentSystem();
    InventorySystem invSys = new InventorySystem();
    NotificationSystem notifSys = new NotificationSystem();
    DeliverySystem delSys = new DeliverySystem();

    if (!invSys.checkStock(items)) return "Out of stock!";
    String orderResult = orderSys.createOrder(items);
    String payResult = paySys.charge(amount);
    invSys.decrement(items);
    notifSys.sendConfirmation("456");
    String delResult = delSys.dispatch("456", address);
    notifSys.sendReadyNotification("456");
    return "Order complete: " + orderResult + ", " + payResult + ", " + delResult;
}`
    },
    painPoints: [
      'Clients (staff) are tightly coupled to every subsystem — changing any subsystem interface breaks all the code that calls it.',
      'High cognitive load — staff must know about 5 different systems, their correct calling order, and how to handle errors from each.',
      'Duplicated orchestration code — every place that processes an order repeats the same 10+ lines of subsystem interactions.',
      'Hard to test — you must set up mock instances of every subsystem just to test a simple order flow.'
    ]
  },
  solution: {
    narrative: `We create a TakeoutFacade that wraps all the subsystems behind a single, simple method: placeOrder(items, amount, address). The facade handles the correct sequence of calls, error handling, and cleanup. Staff no longer need to know about OrderSystem, PaymentSystem, InventorySystem — they just call the facade. The complex subsystems are still available for those who need direct access (e.g., for troubleshooting), but the common workflow is simplified.`,
    code: {
      python: `class OrderSystem:
    def create_order(self, items): return "Order #456 created"
class PaymentSystem:
    def charge(self, amount): return "Payment approved"
class InventorySystem:
    def check_stock(self, items): return True
    def decrement(self, items): return "Stock updated"
class NotificationSystem:
    def send_confirmation(self, order_id): pass
    def send_ready_notification(self, order_id): pass
class DeliverySystem:
    def dispatch(self, order_id, address): return "Delivery dispatched"

# The Facade — one simple interface hiding a complex subsystem
class TakeoutFacade:
    def __init__(self):
        self.order_sys = OrderSystem()
        self.pay_sys = PaymentSystem()
        self.inv_sys = InventorySystem()
        self.notif_sys = NotificationSystem()
        self.del_sys = DeliverySystem()

    def place_order(self, items, amount, address):
        """Single method — staff only need this one interface."""
        if not self.inv_sys.check_stock(items):
            return "Sorry, some items are out of stock."

        order_result = self.order_sys.create_order(items)
        pay_result = self.pay_sys.charge(amount)
        self.inv_sys.decrement(items)
        self.notif_sys.send_confirmation("456")
        del_result = self.del_sys.dispatch("456", address)
        self.notif_sys.send_ready_notification("456")
        return f"Order complete! {order_result}"

# Staff just calls one method — no subsystem knowledge required
facade = TakeoutFacade()
result = facade.place_order(["Burger", "Fries"], 15.99, "123 Main St")`,
      javascript: `class OrderSystem {
  createOrder(items) { return "Order #456 created"; }
}
class PaymentSystem {
  charge(amount) { return "Payment approved"; }
}
class InventorySystem {
  checkStock(items) { return true; }
  decrement(items) { return "Stock updated"; }
}
class NotificationSystem {
  sendConfirmation(orderId) {}
  sendReadyNotification(orderId) {}
}
class DeliverySystem {
  dispatch(orderId, address) { return "Delivery dispatched"; }
}

// The Facade — one simple interface hiding a complex subsystem
class TakeoutFacade {
  constructor() {
    this.orderSys = new OrderSystem();
    this.paySys = new PaymentSystem();
    this.invSys = new InventorySystem();
    this.notifSys = new NotificationSystem();
    this.delSys = new DeliverySystem();
  }

  placeOrder(items, amount, address) {
    if (!this.invSys.checkStock(items)) {
      return "Sorry, some items are out of stock.";
    }
    const orderResult = this.orderSys.createOrder(items);
    const payResult = this.paySys.charge(amount);
    this.invSys.decrement(items);
    this.notifSys.sendConfirmation("456");
    const delResult = this.delSys.dispatch("456", address);
    this.notifSys.sendReadyNotification("456");
    return "Order complete! " + orderResult;
  }
}

const facade = new TakeoutFacade();
const result = facade.placeOrder(["Burger", "Fries"], 15.99, "123 Main St");`,
      java: `class OrderSystem {
    String createOrder(List<String> items) { return "Order #456 created"; }
}
class PaymentSystem {
    String charge(double amount) { return "Payment approved"; }
}
class InventorySystem {
    boolean checkStock(List<String> items) { return true; }
    String decrement(List<String> items) { return "Stock updated"; }
}
class NotificationSystem {
    void sendConfirmation(String orderId) {}
    void sendReadyNotification(String orderId) {}
}
class DeliverySystem {
    String dispatch(String orderId, String address) { return "Delivery dispatched"; }
}

// The Facade — one simple interface hiding a complex subsystem
class TakeoutFacade {
    private OrderSystem orderSys = new OrderSystem();
    private PaymentSystem paySys = new PaymentSystem();
    private InventorySystem invSys = new InventorySystem();
    private NotificationSystem notifSys = new NotificationSystem();
    private DeliverySystem delSys = new DeliverySystem();

    public String placeOrder(List<String> items, double amount, String address) {
        if (!invSys.checkStock(items)) {
            return "Sorry, some items are out of stock.";
        }
        String orderResult = orderSys.createOrder(items);
        String payResult = paySys.charge(amount);
        invSys.decrement(items);
        notifSys.sendConfirmation("456");
        String delResult = delSys.dispatch("456", address);
        notifSys.sendReadyNotification("456");
        return "Order complete! " + orderResult;
    }
}

// Staff just calls one method — no subsystem knowledge required
TakeoutFacade facade = new TakeoutFacade();
String result = facade.placeOrder(Arrays.asList("Burger", "Fries"), 15.99, "123 Main St");`
    },
    changes: 'The TakeoutFacade class encapsulates all subsystem interactions. Staff call a single placeOrder() method instead of orchestrating 5 subsystems. The complex interfaces (OrderSystem, PaymentSystem, etc.) are still available for advanced use cases, but the common workflow is simplified. Changes to a subsystem only affect the facade, not client code.'
  },
  whyUsed: [
    'Simplifies client interaction with complex subsystems — one method call replaces a dozen.', 
    'Decouples client code from subsystem internals — subsystems can be refactored or replaced without affecting the client.',
    'Promotes a clean layered architecture — the facade sits between the presentation layer and the complex business/domain logic.',
    'Reduces duplication — the orchestration logic lives in one place instead of being repeated across every client.',
    'Provides a sensible default interface while allowing advanced clients to bypass the facade and work with subsystems directly.'
  ],
  realWorldExamples: [
    'JavaScript\'s jQuery library is a Facade over the complex and inconsistent DOM APIs (querySelector, addEventListener, fetch, etc.), providing a clean, chainable interface.',
    'Python\'s requests library is a Facade over Python\'s lower-level urllib and httplib, hiding connection management, encoding, and header handling behind a simple get()/post() API.',
    'Spring\'s JdbcTemplate is a Facade over JDBC — it handles connection acquisition, statement creation, result set iteration, and exception translation behind methods like query() and update().',
    'An operating system\'s file I/O API (open(), read(), write()) is a Facade over the complex disk driver, filesystem, and caching subsystem.'
  ],
  dos: [
    'Use Facade when you have a complex subsystem with many interrelated classes and you want to provide a simple default interface for common use cases.',
    'Make the Facade a single point of entry for the subsystem — clients that need the full power can still access subsystem classes directly.',
    'Keep the Facade focused — it should cover the 80% use case without trying to expose every possible subsystem feature.',
    'Consider having multiple facades for different client types (e.g., CustomerFacade, StaffFacade, AdminFacade) if different users need different simplified views.'
  ],
  donts: [
    'Don\'t make the Facade a god object — if it grows too large, split it into multiple focused facades.',
    'Don\'t let clients bypass the facade for everything — if all clients always bypass it, the facade isn\'t providing value. Simplify it or remove it.',
    'Don\'t put business logic in the facade — it should orchestrate, not decide. Business rules belong in the domain layer, not in the facade.',
    'Don\'t use Facade when Adapter is needed — if the problem is an incompatible interface, not a complex subsystem, use Adapter instead (see Adapter pattern).'
  ],
  relatedPatterns: [
    {
      name: 'Adapter',
      slug: 'adapter',
      distinction: 'Adapter converts an interface to one the client expects (interface conversion). Facade provides a simplified interface to a complex subsystem (interface simplification). Adapter is about making things fit; Facade is about making things easier.'
    }
  ],
  interactiveType: 'toggle'
};
