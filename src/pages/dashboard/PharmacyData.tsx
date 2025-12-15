import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Package, Users, ShoppingCart, Building2, AlertTriangle, Calendar } from 'lucide-react';

interface Medicine {
  medicine_id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  expiry_date: string;
  supplier: string;
}

interface Customer {
  customer_id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
}

interface Sale {
  sale_id: string;
  date: string;
  customer_name: string;
  medicine_name: string;
  quantity: number;
  total_amount: number;
  payment_mode: string;
}

interface Supplier {
  supplier_id: string;
  supplier_name: string;
  contact: string;
  city: string;
}

export default function PharmacyData() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [lowStock, setLowStock] = useState<Medicine[]>([]);
  const [expiringSoon, setExpiringSoon] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [medicinesRes, customersRes, salesRes, suppliersRes, lowStockRes, expiringRes] = await Promise.all([
        fetch('http://localhost:4000/api/medicines'),
        fetch('http://localhost:4000/api/customers'),
        fetch('http://localhost:4000/api/sales'),
        fetch('http://localhost:4000/api/suppliers'),
        fetch('http://localhost:4000/api/analytics/low-stock?threshold=200'),
        fetch('http://localhost:4000/api/analytics/expiring-soon?days=180'),
      ]);

      if (!medicinesRes.ok) throw new Error('Failed to load medicines');

      const [medicinesData, customersData, salesData, suppliersData, lowStockData, expiringData] = await Promise.all([
        medicinesRes.json(),
        customersRes.json(),
        salesRes.json(),
        suppliersRes.json(),
        lowStockRes.json(),
        expiringRes.json(),
      ]);

      setMedicines(medicinesData.medicines || []);
      setCustomers(customersData.customers || []);
      setSales(salesData.sales || []);
      setSuppliers(suppliersData.suppliers || []);
      setLowStock(lowStockData.medicines || []);
      setExpiringSoon(expiringData.medicines || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <br />
            <Button onClick={loadData} className="mt-2" variant="outline" size="sm">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pharmacy Data Dashboard</h1>
          <p className="text-muted-foreground">View and analyze pharmacy inventory and sales data</p>
        </div>
        <Button onClick={loadData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicines.length}</div>
            <p className="text-xs text-muted-foreground">
              {lowStock.length} low stock items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-xs text-muted-foreground">
              ₹{sales.reduce((sum, s) => sum + s.total_amount, 0).toFixed(2)} revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Active suppliers</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || expiringSoon.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {lowStock.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{lowStock.length} medicines</strong> have low stock levels
              </AlertDescription>
            </Alert>
          )}
          {expiringSoon.length > 0 && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>{expiringSoon.length} medicines</strong> expiring in next 6 months
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Data Tables */}
      <Tabs defaultValue="medicines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="medicines">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Inventory</CardTitle>
              <CardDescription>Complete list of available medicines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-right p-2">Price</th>
                      <th className="text-right p-2">Stock</th>
                      <th className="text-left p-2">Expiry</th>
                      <th className="text-left p-2">Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med) => (
                      <tr key={med.medicine_id} className="border-b">
                        <td className="p-2">{med.medicine_id}</td>
                        <td className="p-2 font-medium">{med.name}</td>
                        <td className="p-2">
                          <Badge variant="secondary">{med.category}</Badge>
                        </td>
                        <td className="p-2 text-right">₹{med.price}</td>
                        <td className="p-2 text-right">
                          <span className={med.stock < 200 ? 'text-red-600 font-semibold' : ''}>
                            {med.stock}
                          </span>
                        </td>
                        <td className="p-2">{new Date(med.expiry_date).toLocaleDateString()}</td>
                        <td className="p-2">{med.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>Registered customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Age</th>
                      <th className="text-left p-2">Gender</th>
                      <th className="text-left p-2">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((cust) => (
                      <tr key={cust.customer_id} className="border-b">
                        <td className="p-2">{cust.customer_id}</td>
                        <td className="p-2 font-medium">{cust.name}</td>
                        <td className="p-2">{cust.age}</td>
                        <td className="p-2">{cust.gender}</td>
                        <td className="p-2">{cust.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Records</CardTitle>
              <CardDescription>Recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Medicine</th>
                      <th className="text-right p-2">Qty</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-left p-2">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.sale_id} className="border-b">
                        <td className="p-2">{sale.sale_id}</td>
                        <td className="p-2">{new Date(sale.date).toLocaleDateString()}</td>
                        <td className="p-2">{sale.customer_name}</td>
                        <td className="p-2">{sale.medicine_name}</td>
                        <td className="p-2 text-right">{sale.quantity}</td>
                        <td className="p-2 text-right">₹{sale.total_amount}</td>
                        <td className="p-2">
                          <Badge>{sale.payment_mode}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Directory</CardTitle>
              <CardDescription>Active suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Contact</th>
                      <th className="text-left p-2">City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((sup) => (
                      <tr key={sup.supplier_id} className="border-b">
                        <td className="p-2">{sup.supplier_id}</td>
                        <td className="p-2 font-medium">{sup.supplier_name}</td>
                        <td className="p-2">{sup.contact}</td>
                        <td className="p-2">{sup.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Medicines with stock below 200 units</CardDescription>
              </CardHeader>
              <CardContent>
                {lowStock.length === 0 ? (
                  <p className="text-muted-foreground">No low stock items</p>
                ) : (
                  <div className="space-y-2">
                    {lowStock.map((med) => (
                      <div key={med.medicine_id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-muted-foreground">{med.category}</p>
                        </div>
                        <Badge variant="destructive">{med.stock} units</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expiring Soon</CardTitle>
                <CardDescription>Medicines expiring in next 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {expiringSoon.length === 0 ? (
                  <p className="text-muted-foreground">No medicines expiring soon</p>
                ) : (
                  <div className="space-y-2">
                    {expiringSoon.map((med) => (
                      <div key={med.medicine_id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-muted-foreground">{med.category}</p>
                        </div>
                        <Badge variant="outline">{new Date(med.expiry_date).toLocaleDateString()}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
