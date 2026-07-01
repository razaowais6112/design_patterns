import type { PatternData } from '../types';

export const iterator: PatternData = {
  id: 'iterator',
  name: 'Iterator',
  slug: 'iterator',
  category: {
    id: 'behavioral',
    name: 'Behavioral',
    slug: '/behavioral',
    description: 'Concerned with how objects communicate and behave.'
  },
  order: 7,
  intent: 'Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.',
  problem: {
    narrative: `Your restaurant has a Menu class that internally stores menu items in a list. The kitchen staff needs to iterate over menu items in different ways: sometimes forward from first to last (for the customer menu), sometimes only the available items (for the "today's specials" board), and sometimes in reverse order (for the "last added" display). Currently, the Menu exposes its internal list directly, forcing every client to know the internal data structure and implement their own iteration logic. If you change the internal storage from a list to a set or a tree, every client breaks.`,
    code: {
      python: `class MenuItem:
    def __init__(self, name: str, price: float, available: bool):
        self.name = name
        self.price = price
        self.available = available

class Menu:
    def __init__(self):
        # Internal data structure — might change later
        self.items = []

    def add_item(self, item: MenuItem):
        self.items.append(item)

    # Exposing internal list directly — fragile!
    def get_items(self):
        return self.items

# Client must know Menu uses a list and implement iteration itself
menu = Menu()
menu.add_item(MenuItem("Beef Burger", 7.99, True))
menu.add_item(MenuItem("Chicken Burger", 6.99, False))
menu.add_item(MenuItem("Fries", 2.99, True))

# Client needs to know it's a list, implement filtering logic
available_items = [item for item in menu.get_items() if item.available]
for item in available_items:
    print(f"{item.name}: \${item.price}")

# If Menu changes from list to dict, all this breaks`,
      javascript: `class MenuItem {
  constructor(name, price, available) {
    this.name = name;
    this.price = price;
    this.available = available;
  }
}

class Menu {
  constructor() {
    this.items = [];  // Internal data structure — might change later
  }

  addItem(item) {
    this.items.push(item);
  }

  getItems() {
    return this.items;  // Exposing internal list directly — fragile!
  }
}

const menu = new Menu();
menu.addItem(new MenuItem("Beef Burger", 7.99, true));
menu.addItem(new MenuItem("Chicken Burger", 6.99, false));
menu.addItem(new MenuItem("Fries", 2.99, true));

const availableItems = menu.getItems().filter(item => item.available);
for (const item of availableItems) {
  console.log(item.name + ": $" + item.price);
}`,
      java: `class MenuItem {
    String name;
    double price;
    boolean available;

    MenuItem(String name, double price, boolean available) {
        this.name = name;
        this.price = price;
        this.available = available;
    }
}

class Menu {
    private List<MenuItem> items = new ArrayList<>();  // Internal structure

    void addItem(MenuItem item) { items.add(item); }

    List<MenuItem> getItems() { return items; }  // Exposing internal list — fragile!
}

Menu menu = new Menu();
menu.addItem(new MenuItem("Beef Burger", 7.99, true));
menu.addItem(new MenuItem("Chicken Burger", 6.99, false));
menu.addItem(new MenuItem("Fries", 2.99, true));

List<MenuItem> available = new ArrayList<>();
for (MenuItem item : menu.getItems()) {
    if (item.available) available.add(item);
}
for (MenuItem item : available) {
    System.out.println(item.name + ": $" + item.price);
}`
    },
    painPoints: [
      'Menu exposes its internal data structure (the items list), creating tight coupling between the data structure and all client code.',
      'Changing the internal representation (list → set → tree) breaks every client that accesses items directly.',
      'Iteration logic is duplicated across every client — each client must implement filtering, ordering, or traversal themselves.',
      'No way to provide different traversal strategies (forward, reverse, filtered) without each client implementing their own.'
    ]
  },
  solution: {
    narrative: `We make Menu implement the iterable protocol, returning a MenuIterator that encapsulates the traversal logic. Clients can iterate without knowing anything about the internal data structure. We also provide specialized iterators: AvailableItemIterator (only available items) and ReverseItemIterator (reverse order). Menu's internal structure can change without affecting any client code.`,
    code: {
      python: `class MenuItem:
    def __init__(self, name: str, price: float, available: bool):
        self.name = name
        self.price = price
        self.available = available

class Menu:
    def __init__(self):
        self._items = []  # Internal — no direct access

    def add_item(self, item: MenuItem):
        self._items.append(item)

    def __iter__(self):
        """Return a default iterator (forward through all items)."""
        return MenuIterator(self._items)

    def available_iterator(self):
        """Return an iterator that skips unavailable items."""
        return AvailableItemIterator(self._items)

    def reverse_iterator(self):
        """Return an iterator that goes in reverse order."""
        return ReverseItemIterator(self._items)

# Iterator — encapsulates the traversal logic
class MenuIterator:
    def __init__(self, items):
        self._items = items
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self._index >= len(self._items):
            raise StopIteration
        item = self._items[self._index]
        self._index += 1
        return item

class AvailableItemIterator:
    def __init__(self, items):
        self._items = [i for i in items if i.available]
        self._index = 0

    def __iter__(self): return self

    def __next__(self):
        if self._index >= len(self._items):
            raise StopIteration
        item = self._items[self._index]
        self._index += 1
        return item

class ReverseItemIterator:
    def __init__(self, items):
        self._items = items
        self._index = len(items) - 1

    def __iter__(self): return self

    def __next__(self):
        if self._index < 0:
            raise StopIteration
        item = self._items[self._index]
        self._index -= 1
        return item

# Client uses iterators — doesn't care about internal data structure
menu = Menu()
menu.add_item(MenuItem("Beef Burger", 7.99, True))
menu.add_item(MenuItem("Chicken Burger", 6.99, False))
menu.add_item(MenuItem("Fries", 2.99, True))

print("Available items:")
for item in menu.available_iterator():
    print(f"  {item.name}: \${item.price}")`,
      javascript: `class MenuItem {
  constructor(name, price, available) {
    this.name = name;
    this.price = price;
    this.available = available;
  }
}

class Menu {
  constructor() {
    this._items = [];  // Internal — no direct access
  }

  addItem(item) {
    this._items.push(item);
  }

  // Returns an iterator conforming to the iteration protocol
  [Symbol.iterator]() {
    return new MenuIterator(this._items);
  }

  availableIterator() {
    return new AvailableItemIterator(this._items);
  }

  reverseIterator() {
    return new ReverseItemIterator(this._items);
  }
}

class MenuIterator {
  constructor(items) {
    this._items = items;
    this._index = 0;
  }

  next() {
    if (this._index >= this._items.length) {
      return { done: true };
    }
    return { value: this._items[this._index++], done: false };
  }
}

class AvailableItemIterator {
  constructor(items) {
    this._items = items.filter(i => i.available);
    this._index = 0;
  }

  next() {
    if (this._index >= this._items.length) return { done: true };
    return { value: this._items[this._index++], done: false };
  }
}

class ReverseItemIterator {
  constructor(items) {
    this._items = items;
    this._index = items.length - 1;
  }

  next() {
    if (this._index < 0) return { done: true };
    return { value: this._items[this._index--], done: false };
  }
}

const menu = new Menu();
menu.addItem(new MenuItem("Beef Burger", 7.99, true));
menu.addItem(new MenuItem("Chicken Burger", 6.99, false));
menu.addItem(new MenuItem("Fries", 2.99, true));

for (const item of menu.availableIterator()) {
  console.log(item.name + ": $" + item.price);
}`,
      java: `import java.util.Iterator;
import java.util.List;
import java.util.ArrayList;

class MenuItem {
    String name;
    double price;
    boolean available;

    MenuItem(String name, double price, boolean available) {
        this.name = name; this.price = price; this.available = available;
    }
}

class Menu implements Iterable<MenuItem> {
    private List<MenuItem> items = new ArrayList<>();  // Internal — no direct access

    void addItem(MenuItem item) { items.add(item); }

    @Override
    public Iterator<MenuItem> iterator() {
        return new MenuIterator(items);
    }

    public Iterator<MenuItem> availableIterator() {
        return new AvailableItemIterator(items);
    }

    public Iterator<MenuItem> reverseIterator() {
        return new ReverseItemIterator(items);
    }
}

class MenuIterator implements Iterator<MenuItem> {
    private List<MenuItem> items;
    private int index = 0;

    MenuIterator(List<MenuItem> items) { this.items = items; }
    public boolean hasNext() { return index < items.size(); }
    public MenuItem next() { return items.get(index++); }
}

class AvailableItemIterator implements Iterator<MenuItem> {
    private List<MenuItem> filtered;
    private int index = 0;

    AvailableItemIterator(List<MenuItem> items) {
        filtered = new ArrayList<>();
        for (MenuItem item : items) {
            if (item.available) filtered.add(item);
        }
    }
    public boolean hasNext() { return index < filtered.size(); }
    public MenuItem next() { return filtered.get(index++); }
}

class ReverseItemIterator implements Iterator<MenuItem> {
    private List<MenuItem> items;
    private int index;

    ReverseItemIterator(List<MenuItem> items) {
        this.items = items;
        this.index = items.size() - 1;
    }
    public boolean hasNext() { return index >= 0; }
    public MenuItem next() { return items.get(index--); }
}

// Client uses iterators — doesn't care about internal data structure
Menu menu = new Menu();
menu.addItem(new MenuItem("Beef Burger", 7.99, true));
menu.addItem(new MenuItem("Chicken Burger", 6.99, false));
menu.addItem(new MenuItem("Fries", 2.99, true));

for (Iterator<MenuItem> it = menu.availableIterator(); it.hasNext();) {
    MenuItem item = it.next();
    System.out.println(item.name + ": $" + item.price);
}`
    },
    changes: 'The Menu class no longer exposes its internal items list. Instead, it provides iterator() and specialized methods (availableIterator(), reverseIterator()) that return iterator objects. Each iterator encapsulates a specific traversal strategy. The client uses iterators via a uniform interface (hasNext()/next() or for-each syntax) without knowing whether the underlying storage is a list, array, set, or database cursor.'
  },
  whyUsed: [
    'Encapsulates traversal logic — the client doesn\'t need to know how the collection is structured or how to traverse it.',
    'Provides a uniform interface for traversing different data structures — lists, sets, trees, and custom collections all support the same iteration protocol.',
    'Supports multiple concurrent traversals — each iterator has its own state, so multiple clients can traverse the same collection independently.',
    'Enables multiple traversal strategies — forward, reverse, filtered, or any custom traversal without changing the collection class.',
    'Simplifies the collection interface — the collection only manages its elements; iteration concerns live in separate iterator objects.'
  ],
  realWorldExamples: [
    'Java\'s java.util.Iterator and the Iterable interface are the canonical Iterator pattern — every Collection (List, Set, Queue) provides an iterator() method that returns an Iterator for traversing its elements.',
    'Python\'s for...in loop and the iterator protocol (__iter__ and __next__) are built around the Iterator pattern — any object implementing __iter__ can be used in a for loop.',
    'JavaScript\'s Symbol.iterator protocol allows objects to define their iteration behavior, used by for...of loops, spread operators [...obj], and Array.from().',
    'C#\'s IEnumerable<T> and IEnumerator<T> and the yield return keyword allow the compiler to generate iterator state machines automatically, a language-level implementation of the pattern.'
  ],
  dos: [
    'Use Iterator when your collection has a complex internal structure and you want to hide it from clients.',
    'Provide multiple iterator factory methods for common traversal needs (forward, reverse, filtered, paginated).',
    'Make iterators fail-fast when appropriate — if the collection is modified during iteration, throw a clear error rather than silently producing incorrect results.',
    'Implement the standard iteration protocol of your language (Iterable/Iterator interfaces) so clients can use for-each syntax.'
  ],
  donts: [
    'Don\'t implement custom iterators for simple lists or arrays — built-in language iteration (for, for-each, enhanced for-loop) already does this.',
    'Don\'t put traversal logic in the collection itself — that mixes concerns and prevents multiple simultaneous traversals.',
    'Don\'t make iterators stateful in ways that confuse clients — an iterator that modifies the collection during iteration produces bugs.',
    'Don\'t expose internal collection details through the iterator — the return value should be the element, not the internal index/pointer.'
  ],
  relatedPatterns: [
    {
      name: 'Observer',
      slug: 'observer',
      distinction: 'Iterator is about sequentially accessing elements one at a time. Observer is about being notified of changes. An iterator efficiently moves through existing data; an observer awaits new data or events.'
    }
  ],
  interactiveType: 'dropdown'
};
