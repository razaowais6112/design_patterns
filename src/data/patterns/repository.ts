import type { PatternData } from '../types';

export const repository: PatternData = {
  id: 'repository',
  name: 'Repository',
  slug: 'repository',
  category: {
    id: 'data-access',
    name: 'Data Access',
    slug: '/data-access',
    description: 'Concerned with how application logic is decoupled from data persistence.'
  },
  order: 10,
  intent: 'Mediate between the domain and data mapping layers using a collection-like interface for accessing domain objects.',
  problem: {
    narrative: `Your burger restaurant's application code is littered with direct database queries. When you need a list of today's orders, you write SQL. When you need to find a customer by email, you write SQL. When you need to save a modified order, you write SQL. The business logic is tightly coupled to the database — if you switch from PostgreSQL to MongoDB or from SQL to a REST API, you must change every piece of code that queries data. Even a simple change like renaming a database column breaks dozens of files. Unit testing requires a real database connection because the queries are embedded in business logic.`,
    code: {
      python: `import sqlite3

class OrderService:
    def get_todays_orders(self):
        # Direct SQL embedded in business logic
        conn = sqlite3.connect("restaurant.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE date = date('now')")
        rows = cursor.fetchall()
        conn.close()
        return rows  # Returns raw tuples — no object mapping

    def find_order(self, order_id: int):
        conn = sqlite3.connect("restaurant.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        row = cursor.fetchone()
        conn.close()
        return row

    def save_order(self, data: dict):
        conn = sqlite3.connect("restaurant.db")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO orders (customer, items, total) VALUES (?, ?, ?)",
            (data["customer"], str(data["items"]), data["total"])
        )
        conn.commit()
        conn.close()

# Every method duplicates connection management and SQL
# Switching databases means rewriting every method
# Testing requires an actual database`,
      javascript: `const sqlite3 = require("sqlite3");

class OrderService {
  getTodaysOrders() {
    const db = new sqlite3.Database("restaurant.db");
    // Direct SQL embedded in business logic
    db.all("SELECT * FROM orders WHERE date = date('now')", (err, rows) => {
      db.close();
      return rows;
    });
  }

  findOrder(orderId) {
    const db = new sqlite3.Database("restaurant.db");
    db.get("SELECT * FROM orders WHERE id = ?", [orderId], (err, row) => {
      db.close();
      return row;
    });
  }

  saveOrder(data) {
    const db = new sqlite3.Database("restaurant.db");
    db.run(
      "INSERT INTO orders (customer, items, total) VALUES (?, ?, ?)",
      [data.customer, JSON.stringify(data.items), data.total],
      () => db.close()
    );
  }
}`,
      java: `import java.sql.*;

class OrderService {
    public List<Map<String, Object>> getTodaysOrders() throws SQLException {
        // Direct SQL embedded in business logic
        Connection conn = DriverManager.getConnection("jdbc:sqlite:restaurant.db");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM orders WHERE date = date('now')");

        List<Map<String, Object>> orders = new ArrayList<>();
        while (rs.next()) {
            Map<String, Object> order = new HashMap<>();
            order.put("id", rs.getInt("id"));
            order.put("customer", rs.getString("customer"));
            orders.add(order);
        }
        conn.close();
        return orders;
    }

    public void saveOrder(Order order) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:sqlite:restaurant.db");
        PreparedStatement stmt = conn.prepareStatement(
            "INSERT INTO orders (customer, items, total) VALUES (?, ?, ?)"
        );
        stmt.setString(1, order.getCustomer());
        stmt.setString(2, order.getItemsAsJson());
        stmt.setDouble(3, order.getTotal());
        stmt.executeUpdate();
        conn.close();
    }
}`
    },
    painPoints: [
      'Business logic is tightly coupled to the database — SQL queries appear in every method that needs data, making the database a cross-cutting concern.',
      'Switching storage technology (SQL → NoSQL → REST API) requires rewriting all data access code across the entire codebase.',
      'Duplicated connection management and query construction — every method opens connections, executes queries, and handles errors the same way.',
      'Impossible to unit test business logic without a real database — you can\'t mock or replace the storage layer because it\'s hardcoded into the business logic.',
      'Changes to the database schema (column rename, table split) cascade into changes in every function that touches data.'
    ]
  },
  solution: {
    narrative: `We introduce a OrderRepository interface that looks like an in-memory collection of Order objects — with methods like findById(), findAll(), save(), and delete(). The business logic (OrderService) depends only on this interface, never on the database directly. The concrete implementation (SqliteOrderRepository) handles all SQL, connection management, and object mapping. Switching databases means writing a new repository implementation — the business logic never changes.`,
    code: {
      python: `from abc import ABC, abstractmethod

class Order:
    """A domain object — no database knowledge."""
    def __init__(self, id: int, customer: str, items: list, total: float):
        self.id = id
        self.customer = customer
        self.items = items
        self.total = total

# Repository interface — looks like an in-memory collection
class OrderRepository(ABC):
    @abstractmethod
    def find_by_id(self, order_id: int) -> Order | None: pass

    @abstractmethod
    def find_today_orders(self) -> list[Order]: pass

    @abstractmethod
    def save(self, order: Order): pass

    @abstractmethod
    def delete(self, order_id: int): pass

# Concrete implementation — SQL details hidden here
class SqliteOrderRepository(OrderRepository):
    def __init__(self, db_path: str = "restaurant.db"):
        self.db_path = db_path

    def find_by_id(self, order_id: int) -> Order | None:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return Order(id=row[0], customer=row[1],
                        items=eval(row[2]), total=row[3])
        return None

    def find_today_orders(self) -> list[Order]:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE date = date('now')")
        rows = cursor.fetchall()
        conn.close()
        return [Order(id=r[0], customer=r[1],
                      items=eval(r[2]), total=r[3]) for r in rows]

    def save(self, order: Order):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO orders (customer, items, total) VALUES (?, ?, ?)",
            (order.customer, str(order.items), order.total)
        )
        conn.commit()
        conn.close()

    def delete(self, order_id: int):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM orders WHERE id = ?", (order_id,))
        conn.commit()
        conn.close()

# Business logic depends on abstraction — not SQL
class OrderService:
    def __init__(self, repo: OrderRepository):  # Repository injected
        self.repo = repo

    def get_summary(self) -> str:
        orders = self.repo.find_today_orders()
        total = sum(o.total for o in orders)
        return f"Today: {len(orders)} orders, \${total:.2f} total"

    def cancel_order(self, order_id: int):
        order = self.repo.find_by_id(order_id)
        if order:
            self.repo.delete(order_id)
            return f"Order #{order_id} cancelled"
        return "Order not found"`,
      javascript: `class Order {
  constructor(id, customer, items, total) {
    this.id = id; this.customer = customer;
    this.items = items; this.total = total;
  }
}

// Repository interface
class OrderRepository {
  findById(id) { throw new Error("Abstract"); }
  findTodayOrders() { throw new Error("Abstract"); }
  save(order) { throw new Error("Abstract"); }
  delete(id) { throw new Error("Abstract"); }
}

// SQLite implementation — SQL is encapsulated here
class SqliteOrderRepository extends OrderRepository {
  constructor(dbPath = "restaurant.db") {
    super();
    this.dbPath = dbPath;
  }

  #query(sql, params = []) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.dbPath);
      db.all(sql, params, (err, rows) => {
        db.close();
        err ? reject(err) : resolve(rows);
      });
    });
  }

  async findById(id) {
    const rows = await this.#query("SELECT * FROM orders WHERE id = ?", [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return new Order(r.id, r.customer, JSON.parse(r.items), r.total);
  }

  async findTodayOrders() {
    const rows = await this.#query("SELECT * FROM orders WHERE date = date('now')");
    return rows.map(r => new Order(r.id, r.customer, JSON.parse(r.items), r.total));
  }

  async save(order) {
    await this.#query(
      "INSERT INTO orders (customer, items, total) VALUES (?, ?, ?)",
      [order.customer, JSON.stringify(order.items), order.total]
    );
  }

  async delete(id) {
    await this.#query("DELETE FROM orders WHERE id = ?", [id]);
  }
}

class OrderService {
  constructor(repo) {
    this.repo = repo;  // Repository injected
  }

  async getSummary() {
    const orders = await this.repo.findTodayOrders();
    const total = orders.reduce((sum, o) => sum + o.total, 0);
    return "Today: " + orders.length + " orders, $" + total.toFixed(2) + " total";
  }

  async cancelOrder(orderId) {
    const order = await this.repo.findById(orderId);
    if (order) {
      await this.repo.delete(orderId);
      return "Order #" + orderId + " cancelled";
    }
    return "Order not found";
  }
}`,
      java: `// Domain object — no database awareness
class Order {
    private int id;
    private String customer;
    private List<String> items;
    private double total;

    public Order(int id, String customer, List<String> items, double total) {
        this.id = id; this.customer = customer;
        this.items = items; this.total = total;
    }

    public int getId() { return id; }
    public String getCustomer() { return customer; }
    public List<String> getItems() { return items; }
    public double getTotal() { return total; }
}

// Repository interface — looks like an in-memory collection
interface OrderRepository {
    Order findById(int id);
    List<Order> findTodayOrders();
    void save(Order order);
    void delete(int id);
}

// SQL implementation — all database details hidden here
class SqliteOrderRepository implements OrderRepository {
    private String dbPath;

    public SqliteOrderRepository(String dbPath) {
        this.dbPath = dbPath;
    }

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + dbPath);
    }

    private Order mapRow(ResultSet rs) throws SQLException {
        List<String> items = Arrays.asList(rs.getString("items").split(","));
        return new Order(rs.getInt("id"), rs.getString("customer"),
                        items, rs.getDouble("total"));
    }

    @Override
    public Order findById(int id) {
        try (Connection conn = getConnection()) {
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT * FROM orders WHERE id = ?");
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            return rs.next() ? mapRow(rs) : null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Order> findTodayOrders() {
        try (Connection conn = getConnection()) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                "SELECT * FROM orders WHERE date = date('now')");
            List<Order> orders = new ArrayList<>();
            while (rs.next()) orders.add(mapRow(rs));
            return orders;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void save(Order order) {
        // INSERT implementation
    }

    @Override
    public void delete(int id) {
        // DELETE implementation
    }
}

// Business logic — depends only on the interface
class OrderService {
    private OrderRepository repo;  // Repository injected

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    public String getSummary() {
        List<Order> orders = repo.findTodayOrders();
        double total = orders.stream().mapToDouble(Order::getTotal).sum();
        return "Today: " + orders.size() + " orders, $" + total + " total";
    }

    public String cancelOrder(int orderId) {
        Order order = repo.findById(orderId);
        if (order != null) {
            repo.delete(orderId);
            return "Order #" + orderId + " cancelled";
        }
        return "Order not found";
    }
}`
    },
    changes: 'The data access logic is extracted into a repository interface and implementation. OrderService depends only on the OrderRepository interface and works with domain objects (Order), not raw database rows. Connection management, SQL queries, and object mapping are encapsulated in the concrete repository. Switching from SQLite to PostgreSQL requires a new PostgresOrderRepository implementation — OrderService stays unchanged. For testing, a mock or in-memory repository can be used without a database.'
  },
  whyUsed: [
    'Decouples business logic from data persistence — the domain layer doesn\'t know or care about the database technology.',
    'Enables unit testing without a database — a mock or in-memory repository can replace the real one in tests.',
    'Centralizes data access logic — queries, connection management, and object mapping live in one place instead of being scattered across the codebase.',
    'Provides a collection-like API — the rest of the application interacts with repositories using familiar methods (find, save, delete) rather than SQL.',
    'Supports swapping storage strategies — switching from SQL to NoSQL to a REST API means writing a new repository implementation, not changing business code.'
  ],
  realWorldExamples: [
    'Spring Data JPA\'s JpaRepository interface is a full Repository implementation — you define an interface (e.g., interface OrderRepo extends JpaRepository<Order, Long>) and get findAll(), findById(), save(), etc. automatically without writing any SQL.',
    'Hibernate\'s DAO (Data Access Object) pattern is a precursor/reference to Repository — it abstracts persistence behind an interface specific to each entity type.',
    'Python\'s SQLAlchemy with the repository pattern wraps ORM sessions behind custom repository classes, allowing business logic to query through the repository interface rather than directly through the ORM.',
    'Node.js/Mongoose for MongoDB uses a Repository-like pattern — each Model provides a collection-like API (find(), findById(), save(), deleteOne()) that abstracts the underlying MongoDB driver.'
  ],
  dos: [
    'Use Repository when you want to keep your domain layer completely ignorant of persistence concerns — the domain should work with in-memory objects through a collection-like API.',
    'Design the repository interface in terms of the domain, not the database — methods should convey business intent (findActiveOrders()) rather than database operations (findByStatusEquals()).',
    'Return domain objects, not data transfer objects (DTOs) or raw rows — the repository\'s job is to translate between the storage representation and the domain model.',
    'Keep repository interfaces focused per aggregate root — an OrderRepository handles Order, not MenuItem or Customer. Each aggregate root gets its own repository.'
  ],
  donts: [
    'Don\'t use Repository for simple CRUD with no business logic — if you\'re just passing data to and from a single table without any domain logic, a simple data mapper or ORM might be sufficient.',
    'Don\'t make the repository leak query details into the domain — avoid methods like findBySQL(String sql) or passing query builders as parameters.',
    'Don\'t put business logic in the repository — repositories handle persistence, not validation, authorization, or computation.',
    'Don\'t create a repository per database table — repositories correspond to aggregate roots in the domain model, not database tables. Some aggregates span multiple tables.'
  ],
  relatedPatterns: [
    {
      name: 'Adapter',
      slug: 'adapter',
      distinction: 'Repository and Adapter both abstract away external dependencies. Adapter focuses on converting an incompatible interface to match what your code expects (e.g., making a third-party API match your PaymentProcessor). Repository focuses on providing a collection-like interface for data access, abstracting away the storage technology behind a domain-focused API.'
    }
  ],
  interactiveType: 'diagram-only'
};
