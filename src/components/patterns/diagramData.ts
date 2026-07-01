// Each node now has methods[] and an optional icon emoji
// Each diagram has a caption explaining the key takeaway

export interface DiagramNode {
  id: string;
  label: string;
  type: 'class' | 'interface' | 'abstract';
  methods?: string[];
  icon?: string;
  x: number;
  y: number;
  highlight?: boolean;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  style: 'solid' | 'dashed';
}

export interface DiagramDef {
  nodes: DiagramNode[];
  connections: DiagramConnection[];
  caption: string;
  width: number;
  height: number;
}

export interface PatternDiagrams {
  before: DiagramDef;
  after: DiagramDef;
}

const W = 140; // standard node width used in layout

export const DIAGRAMS: Record<string, PatternDiagrams> = {
  factory: {
    before: {
      width: 480, height: 280, caption: 'Kitchen directly creates every burger type — adding a new type means modifying Kitchen code',
      nodes: [
        { id: 'k', label: 'Kitchen', type: 'class', x: 170, y: 10, highlight: true, icon: '🍳', methods: ['makeBurger(type)', '// if type=="beef"...', '// elif type=="chicken"...'] },
        { id: 'b', label: 'BeefBurger', type: 'class', x: 10, y: 190, icon: '🥩', methods: ['cook()'] },
        { id: 'c', label: 'ChickenBurger', type: 'class', x: 170, y: 190, icon: '🍗', methods: ['cook()'] },
        { id: 'v', label: 'VeggieBurger', type: 'class', x: 330, y: 190, icon: '🥬', methods: ['cook()'] },
      ],
      connections: [
        { from: 'k', to: 'b', label: 'new()', style: 'solid' },
        { from: 'k', to: 'c', label: 'new()', style: 'solid' },
        { from: 'k', to: 'v', label: 'new()', style: 'solid' },
      ],
    },
    after: {
      width: 480, height: 340, caption: 'Kitchen asks a Factory to create burgers — new types just need a new Factory subclass',
      nodes: [
        { id: 'k', label: 'Kitchen', type: 'class', x: 170, y: 5, icon: '🍳', methods: ['makeBurger(factory)'] },
        { id: 'bf', label: '«interface» BurgerFactory', type: 'interface', x: 165, y: 110, highlight: true, methods: ['+ create(): Burger'] },
        { id: 'bbf', label: 'BeefFactory', type: 'class', x: 10, y: 240, icon: '🥩', methods: ['create()'] },
        { id: 'cbf', label: 'ChickenFactory', type: 'class', x: 170, y: 240, icon: '🍗', methods: ['create()'] },
        { id: 'vbf', label: 'VeggieFactory', type: 'class', x: 330, y: 240, icon: '🥬', methods: ['create()'] },
      ],
      connections: [
        { from: 'k', to: 'bf', label: 'uses', style: 'dashed' },
        { from: 'bbf', to: 'bf', label: 'implements', style: 'dashed' },
        { from: 'cbf', to: 'bf', label: 'implements', style: 'dashed' },
        { from: 'vbf', to: 'bf', label: 'implements', style: 'dashed' },
      ],
    },
  },

  builder: {
    before: {
      width: 460, height: 240, caption: 'Constructor takes 11 parameters — easy to mix up, hard to read, impossible to maintain',
      nodes: [
        { id: 'caller', label: 'Client Code', type: 'class', x: 10, y: 80, icon: '👤', methods: ['orderBurger()'] },
        { id: 'burger', label: 'Burger', type: 'class', x: 230, y: 40, highlight: true, icon: '🍔', methods: ['__init__(bun, patty,', 'cheese, lettuce, tomato,', 'onion, pickle, ketchup,', 'mustard, sauce, bacon)'] },
      ],
      connections: [
        { from: 'caller', to: 'burger', label: 'new(...11 args!)', style: 'solid' },
      ],
    },
    after: {
      width: 480, height: 260, caption: 'Builder lets you construct step-by-step — only set what you need, readable and flexible',
      nodes: [
        { id: 'caller', label: 'Client Code', type: 'class', x: 10, y: 80, icon: '👤', methods: ['orderBurger()'] },
        { id: 'builder', label: 'BurgerBuilder', type: 'class', x: 180, y: 50, highlight: true, icon: '🔧', methods: ['setBun()', 'setPatty()', 'addTopping()', 'build() → Burger'] },
        { id: 'burger', label: 'Burger', type: 'class', x: 360, y: 80, icon: '🍔', methods: ['ready to serve!'] },
      ],
      connections: [
        { from: 'caller', to: 'builder', label: '.setBun().setPatty()', style: 'solid' },
        { from: 'builder', to: 'burger', label: '.build()', style: 'dashed' },
      ],
    },
  },

  singleton: {
    before: {
      width: 460, height: 280, caption: 'Each counter creates its own Generator — order numbers collide and repeat!',
      nodes: [
        { id: 'r', label: 'Register', type: 'class', x: 10, y: 20, icon: '🖥️', methods: ['gen = new Generator()'] },
        { id: 'ki', label: 'Kiosk', type: 'class', x: 10, y: 170, icon: '📱', methods: ['gen = new Generator()'] },
        { id: 'g1', label: 'Generator #1', type: 'class', x: 260, y: 20, highlight: true, icon: '🔢', methods: ['counter = 0', 'next() → 1, 2, 3...'] },
        { id: 'g2', label: 'Generator #2', type: 'class', x: 260, y: 170, highlight: true, icon: '🔢', methods: ['counter = 0', 'next() → 1, 2, 3...'] },
      ],
      connections: [
        { from: 'r', to: 'g1', label: 'new()', style: 'solid' },
        { from: 'ki', to: 'g2', label: 'new()', style: 'solid' },
      ],
    },
    after: {
      width: 460, height: 280, caption: 'Both counters share ONE Generator — order numbers are always unique and sequential',
      nodes: [
        { id: 'r', label: 'Register', type: 'class', x: 10, y: 20, icon: '🖥️', methods: ['gen = Generator.get()'] },
        { id: 'ki', label: 'Kiosk', type: 'class', x: 10, y: 180, icon: '📱', methods: ['gen = Generator.get()'] },
        { id: 'g', label: 'Generator', type: 'class', x: 260, y: 90, highlight: true, icon: '🔢', methods: ['static instance', 'counter = 0', 'getInstance()', 'next() → 1, 2, 3, 4...'] },
      ],
      connections: [
        { from: 'r', to: 'g', label: 'getInstance()', style: 'dashed' },
        { from: 'ki', to: 'g', label: 'getInstance()', style: 'dashed' },
      ],
    },
  },

  adapter: {
    before: {
      width: 480, height: 260, caption: "QuickPay's API is incompatible — the restaurant can't use it without rewriting everything",
      nodes: [
        { id: 'rest', label: 'Restaurant', type: 'class', x: 10, y: 80, icon: '🏪', methods: ['checkout(processor)'] },
        { id: 'pp', label: '«interface» PaymentProcessor', type: 'interface', x: 200, y: 10, methods: ['+ charge(amount)'] },
        { id: 'qp', label: 'QuickPayAPI', type: 'class', x: 220, y: 170, highlight: true, icon: '⚡', methods: ['sendPayment(cents,', '  currency, token)'] },
      ],
      connections: [
        { from: 'rest', to: 'pp', label: 'uses', style: 'dashed' },
        { from: 'rest', to: 'qp', label: '✗ incompatible!', style: 'solid' },
      ],
    },
    after: {
      width: 500, height: 320, caption: 'Adapter wraps QuickPay and translates its API into the expected interface',
      nodes: [
        { id: 'rest', label: 'Restaurant', type: 'class', x: 10, y: 100, icon: '🏪', methods: ['checkout(processor)'] },
        { id: 'pp', label: '«interface» PaymentProcessor', type: 'interface', x: 210, y: 10, methods: ['+ charge(amount)'] },
        { id: 'adapt', label: 'QuickPayAdapter', type: 'class', x: 200, y: 130, highlight: true, icon: '🔌', methods: ['charge(amount) {', '  api.sendPayment(', '    amount*100,"USD",t)', '}'] },
        { id: 'qp', label: 'QuickPayAPI', type: 'class', x: 340, y: 240, icon: '⚡', methods: ['sendPayment(...)'] },
      ],
      connections: [
        { from: 'rest', to: 'pp', label: 'uses', style: 'dashed' },
        { from: 'adapt', to: 'pp', label: 'implements', style: 'dashed' },
        { from: 'adapt', to: 'qp', label: 'wraps & translates', style: 'solid' },
      ],
    },
  },

  facade: {
    before: {
      width: 500, height: 290, caption: 'Staff code must coordinate 4 subsystems directly — complex, fragile, error-prone',
      nodes: [
        { id: 'staff', label: 'Staff Code', type: 'class', x: 180, y: 5, highlight: true, icon: '👨‍💻', methods: ['order.create()', 'payment.charge()', 'inventory.deduct()', 'notifier.send()'] },
        { id: 'o', label: 'OrderSystem', type: 'class', x: 10, y: 200, icon: '📋', methods: ['create()'] },
        { id: 'p', label: 'PaymentSystem', type: 'class', x: 130, y: 200, icon: '💳', methods: ['charge()'] },
        { id: 'i', label: 'InventorySystem', type: 'class', x: 250, y: 200, icon: '📦', methods: ['deduct()'] },
        { id: 'n', label: 'NotifSystem', type: 'class', x: 370, y: 200, icon: '🔔', methods: ['send()'] },
      ],
      connections: [
        { from: 'staff', to: 'o', style: 'solid' },
        { from: 'staff', to: 'p', style: 'solid' },
        { from: 'staff', to: 'i', style: 'solid' },
        { from: 'staff', to: 'n', style: 'solid' },
      ],
    },
    after: {
      width: 500, height: 340, caption: 'Facade provides ONE simple method — hides all complexity behind a clean interface',
      nodes: [
        { id: 'staff', label: 'Staff Code', type: 'class', x: 180, y: 5, icon: '👨‍💻', methods: ['facade.placeOrder()'] },
        { id: 'facade', label: 'TakeoutFacade', type: 'class', x: 170, y: 110, highlight: true, icon: '🎯', methods: ['placeOrder() {', '  order.create()', '  payment.charge()', '  inventory.deduct()', '  notifier.send()', '}'] },
        { id: 'o', label: 'OrderSystem', type: 'class', x: 10, y: 260, icon: '📋', methods: ['create()'] },
        { id: 'p', label: 'PaymentSystem', type: 'class', x: 130, y: 260, icon: '💳', methods: ['charge()'] },
        { id: 'i', label: 'InventorySystem', type: 'class', x: 250, y: 260, icon: '📦', methods: ['deduct()'] },
        { id: 'n', label: 'NotifSystem', type: 'class', x: 370, y: 260, icon: '🔔', methods: ['send()'] },
      ],
      connections: [
        { from: 'staff', to: 'facade', label: 'one call', style: 'solid' },
        { from: 'facade', to: 'o', style: 'dashed' },
        { from: 'facade', to: 'p', style: 'dashed' },
        { from: 'facade', to: 'i', style: 'dashed' },
        { from: 'facade', to: 'n', style: 'dashed' },
      ],
    },
  },

  observer: {
    before: {
      width: 500, height: 280, caption: 'OrderManager directly calls each listener — adding a new one means editing OrderManager',
      nodes: [
        { id: 'om', label: 'OrderManager', type: 'class', x: 180, y: 5, highlight: true, icon: '📡', methods: ['updateStatus() {', '  kitchen.update()', '  customer.update()', '  loyalty.update()', '}'] },
        { id: 'kd', label: 'KitchenDisplay', type: 'class', x: 10, y: 190, icon: '🖥️', methods: ['update()'] },
        { id: 'cn', label: 'CustomerNotif', type: 'class', x: 170, y: 190, icon: '📱', methods: ['update()'] },
        { id: 'lt', label: 'LoyaltyTracker', type: 'class', x: 340, y: 190, icon: '⭐', methods: ['update()'] },
      ],
      connections: [
        { from: 'om', to: 'kd', label: 'hardcoded', style: 'solid' },
        { from: 'om', to: 'cn', label: 'hardcoded', style: 'solid' },
        { from: 'om', to: 'lt', label: 'hardcoded', style: 'solid' },
      ],
    },
    after: {
      width: 500, height: 340, caption: 'Observers subscribe/unsubscribe freely — OrderManager never changes when you add new ones',
      nodes: [
        { id: 'om', label: 'OrderManager', type: 'class', x: 180, y: 5, icon: '📡', methods: ['observers[]', 'attach(obs)', 'notify() { for obs:', '  obs.update() }'] },
        { id: 'obs', label: '«interface» Observer', type: 'interface', x: 180, y: 140, highlight: true, methods: ['+ update(status)'] },
        { id: 'kd', label: 'KitchenDisplay', type: 'class', x: 10, y: 260, icon: '🖥️', methods: ['update()'] },
        { id: 'cn', label: 'CustomerNotif', type: 'class', x: 170, y: 260, icon: '📱', methods: ['update()'] },
        { id: 'lt', label: 'LoyaltyTracker', type: 'class', x: 340, y: 260, icon: '⭐', methods: ['update()'] },
      ],
      connections: [
        { from: 'om', to: 'obs', label: 'notifies', style: 'dashed' },
        { from: 'kd', to: 'obs', label: 'implements', style: 'dashed' },
        { from: 'cn', to: 'obs', label: 'implements', style: 'dashed' },
        { from: 'lt', to: 'obs', label: 'implements', style: 'dashed' },
      ],
    },
  },

  iterator: {
    before: {
      width: 460, height: 230, caption: 'Client accesses the raw internal list — if Menu changes its data structure, client code breaks',
      nodes: [
        { id: 'client', label: 'Client Code', type: 'class', x: 10, y: 70, icon: '👤', methods: ['items = menu.getList()', 'for i in items: ...'] },
        { id: 'menu', label: 'Menu', type: 'class', x: 260, y: 50, highlight: true, icon: '📜', methods: ['items: List', 'getList() → List', '// exposes internals!'] },
      ],
      connections: [
        { from: 'client', to: 'menu', label: 'directly reads list', style: 'solid' },
      ],
    },
    after: {
      width: 500, height: 330, caption: 'Client uses an Iterator interface — Menu can change internals without breaking anything',
      nodes: [
        { id: 'client', label: 'Client Code', type: 'class', x: 10, y: 100, icon: '👤', methods: ['it = menu.iterator()', 'while it.hasNext():', '  item = it.next()'] },
        { id: 'menu', label: 'Menu', type: 'class', x: 200, y: 10, icon: '📜', methods: ['iterator() → Iterator'] },
        { id: 'iter', label: '«interface» Iterator', type: 'interface', x: 195, y: 130, highlight: true, methods: ['+ hasNext(): bool', '+ next(): Item'] },
        { id: 'fwd', label: 'AllItemsIter', type: 'class', x: 50, y: 250, icon: '➡️', methods: ['next()'] },
        { id: 'avail', label: 'AvailableIter', type: 'class', x: 200, y: 250, icon: '✅', methods: ['next()'] },
        { id: 'rev', label: 'ReverseIter', type: 'class', x: 350, y: 250, icon: '⬅️', methods: ['next()'] },
      ],
      connections: [
        { from: 'client', to: 'iter', label: 'uses', style: 'dashed' },
        { from: 'menu', to: 'iter', label: 'creates', style: 'dashed' },
        { from: 'fwd', to: 'iter', style: 'dashed' },
        { from: 'avail', to: 'iter', style: 'dashed' },
        { from: 'rev', to: 'iter', style: 'dashed' },
      ],
    },
  },

  strategy: {
    before: {
      width: 340, height: 230, caption: 'All pricing logic crammed into one class — grows into unmaintainable spaghetti',
      nodes: [
        { id: 'order', label: 'Order', type: 'class', x: 100, y: 30, highlight: true, icon: '🧾', methods: ['calcTotal() {', '  if regular: price*1', '  elif loyalty: price*.9', '  elif employee: price*.8', '  elif ...: ...', '}'] },
      ],
      connections: [],
    },
    after: {
      width: 500, height: 310, caption: 'Each pricing rule is its own class — swap strategies without touching Order',
      nodes: [
        { id: 'order', label: 'Order', type: 'class', x: 180, y: 5, icon: '🧾', methods: ['strategy: PricingStrategy', 'calcTotal() {', '  strategy.getPrice()', '}'] },
        { id: 'ps', label: '«interface» PricingStrategy', type: 'interface', x: 170, y: 130, highlight: true, methods: ['+ getPrice(base): number'] },
        { id: 'reg', label: 'RegularPricing', type: 'class', x: 10, y: 240, icon: '💵', methods: ['getPrice() → base'] },
        { id: 'loy', label: 'LoyaltyPricing', type: 'class', x: 170, y: 240, icon: '⭐', methods: ['getPrice() → 90%'] },
        { id: 'emp', label: 'EmployeePricing', type: 'class', x: 340, y: 240, icon: '🏷️', methods: ['getPrice() → 80%'] },
      ],
      connections: [
        { from: 'order', to: 'ps', label: 'delegates to', style: 'dashed' },
        { from: 'reg', to: 'ps', style: 'dashed' },
        { from: 'loy', to: 'ps', style: 'dashed' },
        { from: 'emp', to: 'ps', style: 'dashed' },
      ],
    },
  },

  state: {
    before: {
      width: 340, height: 250, caption: 'Order behavior controlled by if/elif chains — adding a new state means editing the whole class',
      nodes: [
        { id: 'order', label: 'Order', type: 'class', x: 100, y: 30, highlight: true, icon: '🧾', methods: ['advance() {', '  if received: cook()', '  elif cooking: ready()', '  elif ready: deliver()', '  elif delivered: error!', '}'] },
      ],
      connections: [],
    },
    after: {
      width: 500, height: 330, caption: 'Each state is its own class — Order delegates behavior to the current state object',
      nodes: [
        { id: 'order', label: 'Order', type: 'class', x: 180, y: 5, icon: '🧾', methods: ['state: OrderState', 'advance() {', '  state.handle(this)', '}'] },
        { id: 'os', label: '«interface» OrderState', type: 'interface', x: 175, y: 130, highlight: true, methods: ['+ handle(order)'] },
        { id: 'rec', label: 'ReceivedState', type: 'class', x: 10, y: 250, icon: '📥', methods: ['handle() → Cooking'] },
        { id: 'cook', label: 'CookingState', type: 'class', x: 170, y: 250, icon: '🔥', methods: ['handle() → Ready'] },
        { id: 'rdy', label: 'ReadyState', type: 'class', x: 340, y: 250, icon: '✅', methods: ['handle() → Delivered'] },
      ],
      connections: [
        { from: 'order', to: 'os', label: 'delegates to', style: 'dashed' },
        { from: 'rec', to: 'os', style: 'dashed' },
        { from: 'cook', to: 'os', style: 'dashed' },
        { from: 'rdy', to: 'os', style: 'dashed' },
      ],
    },
  },

  repository: {
    before: {
      width: 460, height: 230, caption: 'Business logic has raw SQL mixed in — can\'t switch databases or test without a real DB',
      nodes: [
        { id: 'svc', label: 'OrderService', type: 'class', x: 20, y: 50, highlight: true, icon: '⚙️', methods: ['getOrder(id) {', '  db.query("SELECT *', '    FROM orders', '    WHERE id=?", id)', '}'] },
        { id: 'db', label: 'SQLite DB', type: 'class', x: 290, y: 70, icon: '🗄️', methods: ['query(sql)'] },
      ],
      connections: [
        { from: 'svc', to: 'db', label: 'raw SQL', style: 'solid' },
      ],
    },
    after: {
      width: 500, height: 320, caption: 'Service talks to a Repository interface — swap SQLite for Mongo (or a mock) with zero changes',
      nodes: [
        { id: 'svc', label: 'OrderService', type: 'class', x: 10, y: 100, icon: '⚙️', methods: ['getOrder(id) {', '  repo.findById(id)', '}'] },
        { id: 'repo', label: '«interface» OrderRepository', type: 'interface', x: 190, y: 10, highlight: true, methods: ['+ findById(id)', '+ save(order)', '+ delete(id)'] },
        { id: 'sql', label: 'SqliteRepo', type: 'class', x: 130, y: 230, icon: '🗄️', methods: ['findById() → SQL'] },
        { id: 'mongo', label: 'MongoRepo', type: 'class', x: 310, y: 230, icon: '🍃', methods: ['findById() → Mongo'] },
      ],
      connections: [
        { from: 'svc', to: 'repo', label: 'uses', style: 'dashed' },
        { from: 'sql', to: 'repo', label: 'implements', style: 'dashed' },
        { from: 'mongo', to: 'repo', label: 'implements', style: 'dashed' },
      ],
    },
  },
};
