import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, AlertCircle, Plus, Edit, Trash2, Search } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produkte verwalten</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Neues Produkt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Produktkatalog</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Produkt suchen..."
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Product Card */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Schwarzkopf Professional</h3>
                      <p className="text-sm text-gray-500">Haarfärbemittel</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Bestand: 15</span>
                  </div>
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Verkauft: 45</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Mindestbestand: 5</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">€29.99</span>
                  </div>
                </div>
              </div>

              {/* Another Product Card */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Wella Professionals</h3>
                      <p className="text-sm text-gray-500">Haarspülung</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Bestand: 8</span>
                  </div>
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Verkauft: 32</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-red-500">Mindestbestand: 10</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">€19.99</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders and Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Bestellungen & Lager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Pending Orders */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Ausstehende Bestellungen</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Schwarzkopf Professional</p>
                      <p className="text-xs text-gray-500">Bestellnummer: #12345</p>
                    </div>
                    <span className="text-sm">5 Stück</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Wella Professionals</p>
                      <p className="text-xs text-gray-500">Bestellnummer: #12346</p>
                    </div>
                    <span className="text-sm">10 Stück</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  Alle Bestellungen anzeigen
                </button>
              </div>

              {/* Low Stock Alert */}
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium mb-2 text-red-700">Niedriger Lagerbestand</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wella Professionals</span>
                    <span className="text-sm text-red-600">8 Stück</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">L'Oréal Professionnel</span>
                    <span className="text-sm text-red-600">3 Stück</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Bestellen
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 