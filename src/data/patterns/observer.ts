import type { PatternData } from '../types';

export const observer: PatternData = {
  id: 'observer',
  name: 'Observer',
  slug: 'observer',
  category: {
    id: 'behavioral',
    name: 'Behavioral',
    slug: '/behavioral',
    description: 'Concerned with how objects communicate and behave.'
  },
  order: 6,
  intent: 'Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
  problem: {
    narrative: `Your burger restaurant has an OrderManager that tracks the status of each order (received, cooking, ready, delivered). Currently, whenever an order status changes, you manually update every part of the system that cares: the kitchen display screen, the customer notification service, the loyalty points tracker, and the analytics dashboard. Every time a new "interested party" needs to know about order updates — like a new drive-through display — you must modify OrderManager's status-change method to add the notification call. After a few additions, the OrderManager is tangled up with all these unrelated systems.`,
    code: {
      python: `class OrderManager:
    def __init__(self):
        self.status = "received"

    # OrderManager must know about every component that cares about status changes
    def update_status(self, new_status):
        self.status = new_status

        # Hardcoded notifications to every interested component
        kitchen_display = KitchenDisplay()
        kitchen_display.refresh(self.status)

        notifier = CustomerNotifier()
        notifier.send_update(self.status)

        loyalty = LoyaltyTracker()
        loyalty.on_order_update(self.status)

        analytics = AnalyticsDashboard()
        analytics.record_event("order_update", self.status)

        # If we add a drive-through display, we must edit THIS method

class KitchenDisplay:
    def refresh(self, status): print(f"Kitchen: Order is {status}")

class CustomerNotifier:
    def send_update(self, status): print(f"Customer: Order {status}")

class LoyaltyTracker:
    def on_order_update(self, status): print(f"Loyalty: {status}")

class AnalyticsDashboard:
    def record_event(self, name, val): print(f"Analytics: {name}={val}")`,
      javascript: `class OrderManager {
  constructor() {
    this.status = "received";
  }

  updateStatus(newStatus) {
    this.status = newStatus;

    // Hardcoded notifications to every interested component
    const kitchenDisplay = new KitchenDisplay();
    kitchenDisplay.refresh(this.status);

    const notifier = new CustomerNotifier();
    notifier.sendUpdate(this.status);

    const loyalty = new LoyaltyTracker();
    loyalty.onOrderUpdate(this.status);

    const analytics = new AnalyticsDashboard();
    analytics.recordEvent("order_update", this.status);
  }
}

class KitchenDisplay {
  refresh(status) { console.log("Kitchen: Order is", status); }
}
class CustomerNotifier {
  sendUpdate(status) { console.log("Customer: Order", status); }
}
class LoyaltyTracker {
  onOrderUpdate(status) { console.log("Loyalty:", status); }
}
class AnalyticsDashboard {
  recordEvent(name, val) { console.log("Analytics:", name, "=", val); }
}`,
      java: `class OrderManager {
    private String status = "received";

    public void updateStatus(String newStatus) {
        this.status = newStatus;

        // Hardcoded notifications to every interested component
        KitchenDisplay kitchenDisplay = new KitchenDisplay();
        kitchenDisplay.refresh(this.status);

        CustomerNotifier notifier = new CustomerNotifier();
        notifier.sendUpdate(this.status);

        LoyaltyTracker loyalty = new LoyaltyTracker();
        loyalty.onOrderUpdate(this.status);

        AnalyticsDashboard analytics = new AnalyticsDashboard();
        analytics.recordEvent("order_update", this.status);
    }
}

class KitchenDisplay {
    void refresh(String status) { System.out.println("Kitchen: Order is " + status); }
}
class CustomerNotifier {
    void sendUpdate(String status) { System.out.println("Customer: Order " + status); }
}
class LoyaltyTracker {
    void onOrderUpdate(String status) { System.out.println("Loyalty: " + status); }
}
class AnalyticsDashboard {
    void recordEvent(String name, String val) { System.out.println("Analytics: " + name + "=" + val); }
}`
    },
    painPoints: [
      'OrderManager is tightly coupled to every consumer — adding a new subscriber (like a drive-through display) requires modifying OrderManager.',
      'Violates Open/Closed Principle — OrderManager must be modified every time a new observer needs to be added.',
      'Notification logic is duplicated — the pattern of "notify everyone" is mixed into the business logic of changing status.',
      'No centralized subscription management — you can\'t dynamically subscribe or unsubscribe observers at runtime (e.g., only subscribe the analytics dashboard during business hours).'
    ]
  },
  solution: {
    narrative: `We turn OrderManager into a Subject (Observable) with methods to attach, detach, and notify observers. Each interested component implements an Observer interface with a single update() method. When an order status changes, OrderManager calls notify() which loops through all registered observers and calls their update(). New interested parties just need to implement Observer and call attach() — OrderManager never changes.`,
    code: {
      python: `from abc import ABC, abstractmethod

# Observer interface — any class that wants to be notified implements this
class Observer(ABC):
    @abstractmethod
    def update(self, status: str): pass

class OrderManager:  # The Subject (Observable)
    def __init__(self):
        self._observers = []  # List of observers — can grow/shrink at runtime
        self.status = "received"

    def attach(self, observer: Observer):
        self._observers.append(observer)

    def detach(self, observer: Observer):
        self._observers.remove(observer)

    def notify(self):
        for observer in self._observers:
            observer.update(self.status)

    def update_status(self, new_status: str):
        self.status = new_status
        self.notify()  # Tell all observers — no hardcoded references!

# Concrete observers — each implements Observer
class KitchenDisplay(Observer):
    def update(self, status: str):
        print(f"Kitchen: Order is {status}")

class CustomerNotifier(Observer):
    def update(self, status: str):
        print(f"Customer: Order {status}")

class LoyaltyTracker(Observer):
    def update(self, status: str):
        print(f"Loyalty tracking: order {status}")

# Usage — observers subscribe to whatever they care about
manager = OrderManager()
manager.attach(KitchenDisplay())
manager.attach(CustomerNotifier())
manager.attach(LoyaltyTracker())

manager.update_status("cooking")   # Notifies all 3
manager.update_status("ready")     # Notifies all 3

# Adding a new observer doesn't touch OrderManager at all!
class DriveThroughDisplay(Observer):
    def update(self, status: str):
        print(f"Drive-through: Order is {status}")

manager.attach(DriveThroughDisplay())
manager.update_status("delivered")  # Now notifies 4`,
      javascript: `// Observer interface
class Observer {
  update(status) { throw new Error("Abstract method"); }
}

class OrderManager {  // The Subject (Observable)
  constructor() {
    this.observers = [];  // List of observers — can grow/shrink at runtime
    this.status = "received";
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify() {
    for (const observer of this.observers) {
      observer.update(this.status);
    }
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    this.notify();  // Tell all observers — no hardcoded references!
  }
}

class KitchenDisplay extends Observer {
  update(status) { console.log("Kitchen: Order is", status); }
}

class CustomerNotifier extends Observer {
  update(status) { console.log("Customer: Order", status); }
}

class LoyaltyTracker extends Observer {
  update(status) { console.log("Loyalty tracking: order", status); }
}

const manager = new OrderManager();
manager.attach(new KitchenDisplay());
manager.attach(new CustomerNotifier());
manager.attach(new LoyaltyTracker());

manager.updateStatus("cooking");  // Notifies all 3
manager.updateStatus("ready");    // Notifies all 3

class DriveThroughDisplay extends Observer {
  update(status) { console.log("Drive-through: Order is", status); }
}

manager.attach(new DriveThroughDisplay());
manager.updateStatus("delivered");  // Now notifies 4`,
      java: `// Observer interface
interface Observer {
    void update(String status);
}

class OrderManager {  // The Subject (Observable)
    private List<Observer> observers = new ArrayList<>();
    private String status = "received";

    public void attach(Observer observer) {
        observers.add(observer);
    }

    public void detach(Observer observer) {
        observers.remove(observer);
    }

    private void notifyObservers() {
        for (Observer o : observers) {
            o.update(status);
        }
    }

    public void updateStatus(String newStatus) {
        this.status = newStatus;
        notifyObservers();  // Tell all observers — no hardcoded references!
    }
}

class KitchenDisplay implements Observer {
    public void update(String status) {
        System.out.println("Kitchen: Order is " + status);
    }
}

class CustomerNotifier implements Observer {
    public void update(String status) {
        System.out.println("Customer: Order " + status);
    }
}

class LoyaltyTracker implements Observer {
    public void update(String status) {
        System.out.println("Loyalty tracking: order " + status);
    }
}

// Usage
OrderManager manager = new OrderManager();
manager.attach(new KitchenDisplay());
manager.attach(new CustomerNotifier());
manager.attach(new LoyaltyTracker());

manager.updateStatus("cooking");  // Notifies all 3
manager.updateStatus("ready");    // Notifies all 3

// Adding a new observer doesn't touch OrderManager at all!
manager.attach(status -> System.out.println("Drive-through: Order is " + status));
manager.updateStatus("delivered");  // Notifies 4`
    },
    changes: 'OrderManager no longer has hardcoded references to specific components. It maintains a list of observers and notifies them all through a common interface. Adding a new subscriber (like DriveThroughDisplay) is now a single attach() call on the manager instance — OrderManager itself never changes. This satisfies Open/Closed: the subject is open for extension (new observers) but closed for modification.'
  },
  whyUsed: [
    'Supports Open/Closed Principle — the subject doesn\'t need to be modified when new observers are added.',
    'Enables loose coupling — the subject only knows observers implement the Observer interface, not their concrete types.',
    'Supports dynamic relationships — observers can be added or removed at runtime, enabling flexible subscription models.',
    'Ensures broadcast notification — all interested parties are notified simultaneously, maintaining consistency across the system.',
    'Supports one-to-many dependency management without the subject knowing the details of each dependent.'
  ],
  realWorldExamples: [
    'Java\'s java.util.Observer/Observable (now deprecated) and the PropertyChangeListener pattern in Swing/AWT are classic Observer implementations for UI event handling.',
    'React\'s event system uses the Observer pattern — components subscribe to events (onClick, onChange), and when the event fires, all subscribed handlers are called.',
    'Node.js\'s EventEmitter is a pure Observer — objects emit named events, and listeners subscribe via .on(event, handler). The emitter never knows what handlers are registered.',
    'Django\'s signal framework allows decoupled components to get notified when actions happen elsewhere (e.g., post_save signal fires when a model is saved, notifying any registered receivers).'
  ],
  dos: [
    'Use Observer when changes to one object require updating others, and you don\'t know how many others exist ahead of time.',
    'Keep the Observer interface minimal — one update method is usually enough. Complex payload delivery can be handled through a separate event object.',
    'Be careful with ordering — if observers must be notified in a specific sequence, the Observer pattern may not be the right fit, or you need a prioritized observer list.',
    'Handle observer errors gracefully — a failing observer shouldn\'t prevent other observers from receiving notifications.'
  ],
  donts: [
    'Don\'t use Observer for simple one-to-one notifications — a direct method call or callback is simpler.',
    'Don\'t create memory leaks — observers that are no longer needed must be detached; otherwise, the subject holds references preventing garbage collection.',
    'Don\'t make observers do heavy synchronous work in the update method — it blocks the subject. Consider using a queue or async notification for slow observers.',
    'Don\'t let observers modify the subject\'s state during notification — this can cause infinite loops or inconsistent state.'
  ],
  relatedPatterns: [
    {
      name: 'Iterator',
      slug: 'iterator',
      distinction: 'Observer is about notification of state changes to a list of dependents. Iterator is about traversing a collection without exposing its internals. They\'re often used together: an Iterator could be used to traverse the observer list inside the subject\'s notify() method.'
    }
  ],
  interactiveType: 'live-visualization'
};
