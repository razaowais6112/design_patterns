import type { PatternData } from '../types';

export const state: PatternData = {
  id: 'state',
  name: 'State',
  slug: 'state',
  category: {
    id: 'behavioral',
    name: 'Behavioral',
    slug: '/behavioral',
    description: 'Concerned with how objects communicate and behave.'
  },
  order: 9,
  intent: 'Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.',
  problem: {
    narrative: `Your restaurant's Order class tracks an order through several statuses: received, cooking, ready, delivered. Certain operations should only be allowed in certain states — for example, you can't deliver an order that's still cooking, and you can't add items to an order that's already been delivered. Currently, every method on Order checks the current status with if/else conditions before acting. As more states are added (like "picked up" or "cancelled"), every method grows additional conditions, and the logic for which transitions are valid is scattered across the class.`,
    code: {
      python: `class Order:
    def __init__(self):
        self.status = "received"

    def cook(self):
        if self.status == "received":
            print("Cooking the order...")
            self.status = "cooking"
        elif self.status == "cooking":
            print("Order is already being cooked!")
        elif self.status == "ready" or self.status == "delivered":
            print("Can't cook — order is already done!")

    def ready_to_serve(self):
        if self.status == "cooking":
            print("Order is ready!")
            self.status = "ready"
        elif self.status == "received":
            print("Can't serve — order hasn't been cooked yet!")
        elif self.status == "ready":
            print("Order is already marked ready!")
        elif self.status == "delivered":
            print("Order was already delivered!")

    def deliver(self):
        if self.status == "ready":
            print("Delivering the order...")
            self.status = "delivered"
        elif self.status == "delivered":
            print("Order was already delivered!")
        else:
            print("Can't deliver — order isn't ready yet!")

    def add_item(self, item):
        if self.status == "received":
            print(f"Adding {item} to order...")
        elif self.status == "cooking":
            print("Can't add items — already cooking!")
        else:
            print("Can't add items — order is done!")`,
      javascript: `class Order {
  constructor() {
    this.status = "received";
  }

  cook() {
    if (this.status === "received") {
      console.log("Cooking the order...");
      this.status = "cooking";
    } else if (this.status === "cooking") {
      console.log("Order is already being cooked!");
    } else {
      console.log("Can't cook — order is already done!");
    }
  }

  readyToServe() {
    if (this.status === "cooking") {
      console.log("Order is ready!");
      this.status = "ready";
    } else if (this.status === "received") {
      console.log("Can't serve — order hasn't been cooked yet!");
    } else {
      console.log("Order is already marked ready or delivered!");
    }
  }

  deliver() {
    if (this.status === "ready") {
      console.log("Delivering the order...");
      this.status = "delivered";
    } else {
      console.log("Can't deliver — order isn't ready yet!");
    }
  }
}`,
      java: `class Order {
    private String status = "received";

    void cook() {
        if (status.equals("received")) {
            System.out.println("Cooking the order...");
            status = "cooking";
        } else if (status.equals("cooking")) {
            System.out.println("Order is already being cooked!");
        } else {
            System.out.println("Can't cook — order is already done!");
        }
    }

    void readyToServe() {
        if (status.equals("cooking")) {
            System.out.println("Order is ready!");
            status = "ready";
        } else if (status.equals("received")) {
            System.out.println("Can't serve — order hasn't been cooked yet!");
        } else {
            System.out.println("Order is already marked ready or delivered!");
        }
    }

    void deliver() {
        if (status.equals("ready")) {
            System.out.println("Delivering the order...");
            status = "delivered";
        } else {
            System.out.println("Can't deliver — order isn't ready yet!");
        }
    }
}`
    },
    painPoints: [
      'State transition logic is scattered across multiple methods — cook(), readyToServe(), and deliver() each have their own conditional checks.',
      'Adding a new state (e.g., "cancelled") requires modifying every method in the Order class, risking bugs in existing state transitions.',
      'State-specific behavior is mixed with the order\'s core business logic — the class is hard to read and reason about.',
      'Invalid transitions aren\'t caught at a single point — each method independently decides what\'s valid, making it easy to accidentally allow an invalid transition.'
    ]
  },
  solution: {
    narrative: `We model each order status as its own class implementing a common OrderState interface. The Order class delegates all behavior to its current state object. Each state knows what transitions are valid and handles the next() call accordingly. Adding a new state means adding a new class — Order and existing states don't change. State objects can even manage the transition to the next state themselves.`,
    code: {
      python: `from abc import ABC, abstractmethod

# State interface
class OrderState(ABC):
    @abstractmethod
    def cook(self, order): pass
    @abstractmethod
    def ready_to_serve(self, order): pass
    @abstractmethod
    def deliver(self, order): pass
    @abstractmethod
    def add_item(self, order, item): pass

class ReceivedState(OrderState):
    def cook(self, order):
        print("Cooking the order...")
        order.set_state(CookingState())  # Transition to cooking

    def ready_to_serve(self, order):
        print("Can't serve — order hasn't been cooked yet!")

    def deliver(self, order):
        print("Can't deliver — order isn't ready yet!")

    def add_item(self, order, item):
        print(f"Adding {item} to order...")

class CookingState(OrderState):
    def cook(self, order):
        print("Order is already being cooked!")

    def ready_to_serve(self, order):
        print("Order is ready!")
        order.set_state(ReadyState())  # Transition to ready

    def deliver(self, order):
        print("Can't deliver — order isn't ready yet!")

    def add_item(self, order, item):
        print("Can't add items — already cooking!")

class ReadyState(OrderState):
    def cook(self, order):
        print("Can't cook — order is already done!")

    def ready_to_serve(self, order):
        print("Order is already marked ready!")

    def deliver(self, order):
        print("Delivering the order...")
        order.set_state(DeliveredState())  # Transition to delivered

    def add_item(self, order, item):
        print("Can't add items — order is done!")

class DeliveredState(OrderState):
    def cook(self, order):
        print("Order has been delivered — can't cook!")

    def ready_to_serve(self, order):
        print("Order was already delivered!")

    def deliver(self, order):
        print("Order was already delivered!")

    def add_item(self, order, item):
        print("Can't add items — order is done!")

class Order:
    def __init__(self):
        self._state = ReceivedState()  # Start state

    def set_state(self, state: OrderState):
        self._state = state

    def cook(self): self._state.cook(self)
    def ready_to_serve(self): self._state.ready_to_serve(self)
    def deliver(self): self._state.deliver(self)
    def add_item(self, item): self._state.add_item(self, item)

# Usage — Order delegates to its current state
order = Order()
order.add_item("Burger")   # Allowed
order.cook()               # Received → Cooking
order.add_item("Fries")    # Denied — already cooking
order.ready_to_serve()     # Cooking → Ready
order.deliver()            # Ready → Delivered
order.deliver()            # Denied — already delivered`,
      javascript: `class OrderState {
  cook(order) { throw new Error("Abstract method"); }
  readyToServe(order) { throw new Error("Abstract method"); }
  deliver(order) { throw new Error("Abstract method"); }
  addItem(order, item) { throw new Error("Abstract method"); }
}

class ReceivedState extends OrderState {
  cook(order) { console.log("Cooking the order..."); order.setState(new CookingState()); }
  readyToServe(order) { console.log("Can't serve — not cooked yet!"); }
  deliver(order) { console.log("Can't deliver — not ready yet!"); }
  addItem(order, item) { console.log("Adding " + item + " to order..."); }
}

class CookingState extends OrderState {
  cook(order) { console.log("Already cooking!"); }
  readyToServe(order) { console.log("Order is ready!"); order.setState(new ReadyState()); }
  deliver(order) { console.log("Can't deliver — not ready yet!"); }
  addItem(order, item) { console.log("Can't add items — already cooking!"); }
}

class ReadyState extends OrderState {
  cook(order) { console.log("Can't cook — order is done!"); }
  readyToServe(order) { console.log("Already marked ready!"); }
  deliver(order) { console.log("Delivering..."); order.setState(new DeliveredState()); }
  addItem(order, item) { console.log("Can't add items — order is done!"); }
}

class DeliveredState extends OrderState {
  cook(order) { console.log("Order delivered — can't cook!"); }
  readyToServe(order) { console.log("Already delivered!"); }
  deliver(order) { console.log("Already delivered!"); }
  addItem(order, item) { console.log("Can't add items — order is done!"); }
}

class Order {
  constructor() {
    this._state = new ReceivedState();
  }
  setState(state) { this._state = state; }
  cook() { this._state.cook(this); }
  readyToServe() { this._state.readyToServe(this); }
  deliver() { this._state.deliver(this); }
  addItem(item) { this._state.addItem(this, item); }
}`,
      java: `interface OrderState {
    void cook(Order order);
    void readyToServe(Order order);
    void deliver(Order order);
    void addItem(Order order, String item);
}

class ReceivedState implements OrderState {
    public void cook(Order o) { System.out.println("Cooking..."); o.setState(new CookingState()); }
    public void readyToServe(Order o) { System.out.println("Not cooked yet!"); }
    public void deliver(Order o) { System.out.println("Not ready yet!"); }
    public void addItem(Order o, String i) { System.out.println("Adding " + i + "..."); }
}

class CookingState implements OrderState {
    public void cook(Order o) { System.out.println("Already cooking!"); }
    public void readyToServe(Order o) { System.out.println("Ready!"); o.setState(new ReadyState()); }
    public void deliver(Order o) { System.out.println("Not ready yet!"); }
    public void addItem(Order o, String i) { System.out.println("Already cooking!"); }
}

class ReadyState implements OrderState {
    public void cook(Order o) { System.out.println("Done!"); }
    public void readyToServe(Order o) { System.out.println("Already ready!"); }
    public void deliver(Order o) { System.out.println("Delivering..."); o.setState(new DeliveredState()); }
    public void addItem(Order o, String i) { System.out.println("Order is done!"); }
}

class DeliveredState implements OrderState {
    public void cook(Order o) { System.out.println("Already delivered!"); }
    public void readyToServe(Order o) { System.out.println("Already delivered!"); }
    public void deliver(Order o) { System.out.println("Already delivered!"); }
    public void addItem(Order o, String i) { System.out.println("Order is done!"); }
}

class Order {
    private OrderState state = new ReceivedState();
    void setState(OrderState s) { this.state = s; }
    void cook() { state.cook(this); }
    void readyToServe() { state.readyToServe(this); }
    void deliver() { state.deliver(this); }
    void addItem(String item) { state.addItem(this, item); }
}`
    },
    changes: 'Each state is encapsulated in its own class. The Order class delegates all operations to its current state object and has no conditionals of its own. Transitions happen inside the state classes — e.g., CookingState.readyToServe() changes the order\'s state to ReadyState. Adding a new state (like "cancelled") requires only a new state class; Order and existing states don\'t need to change.'
  },
  whyUsed: [
    'Eliminates large conditional statements spread across multiple methods — state-specific behavior lives in dedicated state classes.',
    'Supports Open/Closed Principle — new states are added as new classes without modifying existing state classes or the context.',
    'Makes state transitions explicit and centralized — each state class controls which transitions are valid and handles the transition logic.',
    'Improves maintainability — each state class is small, focused on a single state\'s behavior, and independently testable.',
    'Prevents invalid states — the Order can never be in an inconsistent state because state classes control valid transitions.'
  ],
  realWorldExamples: [
    'Java\'s javax.faces.lifecycle.Lifecycle in JSF uses State to manage the phases of the JSF request lifecycle (Restore View, Apply Request Values, Process Validation, etc.) — each phase is a state that knows which phase comes next.',
    'TCP connection implementations use State — a socket behaves differently in the LISTENING, ESTABLISHED, CLOSED, and TIME_WAIT states, and only certain transitions between states are valid.',
    'Redux or Zustand state management with reducers is State-adjacent — the application state determines behavior, and only specific actions transition to new states.',
    'Video player applications (like YouTube or VLC) use State — the player behaves differently in Playing, Paused, Buffering, and Stopped states.'
  ],
  dos: [
    'Use State when an object\'s behavior depends on its internal state and changes at runtime based on that state.',
    'Keep state classes small — each state should only handle the operations that are valid in that state.',
    'Make state objects stateless when possible (no instance variables of their own) — they can then be shared across contexts.',
    'Let states control transitions — the state class should set the next state when an operation causes a transition.'
  ],
  donts: [
    'Don\'t use State for simple boolean flags — if you only have two states, a simple if/else in the context class is cleaner.',
    'Don\'t let the context class bypass the state — all state-dependent operations must go through the current state object.',
    'Don\'t put business logic in states that doesn\'t vary by state — common logic belongs in the context class.',
    'Don\'t confuse State with Strategy — State manages state-dependent behavior transitions; Strategy selects among independent algorithms (see Strategy pattern).'
  ],
  relatedPatterns: [
    {
      name: 'Strategy',
      slug: 'strategy',
      distinction: 'Both State and Strategy use composition to change behavior. But in Strategy, the client selects and injects a strategy (the algorithm is chosen externally). In State, the state object itself decides the next state (transitions are managed internally). Strategy is external choice; State is internal evolution.'
    }
  ],
  interactiveType: 'live-visualization'
};
