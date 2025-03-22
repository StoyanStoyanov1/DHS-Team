import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Calendar, ArrowUpRight, ArrowDownRight, BarChart3, PieChart, Download } from "lucide-react";

export default function FinancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Finanzübersicht</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Bericht herunterladen
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">€12,450</h3>
            <p className="text-sm text-gray-500">Gesamteinnahmen (März)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex items-center text-red-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm">-3.2%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">€4,280</h3>
            <p className="text-sm text-gray-500">Ausgaben (März)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center text-blue-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+8.3%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">€8,170</h3>
            <p className="text-sm text-gray-500">Nettogewinn (März)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center text-purple-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+5.7%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">€245</h3>
            <p className="text-sm text-gray-500">Durchschnittlicher Kundenwert</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Umsatzentwicklung</CardTitle>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">Woche</button>
                <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">Monat</button>
                <button className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90">Jahr</button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Revenue Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Umsatzverteilung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <PieChart className="h-12 w-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Financial Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detaillierte Finanzinformationen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Revenue Breakdown */}
              <div>
                <h3 className="font-medium mb-4">Umsatzaufschlüsselung</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      <span className="text-sm">Haarschnitte</span>
                    </div>
                    <span className="text-sm font-medium">€4,850</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Färbungen</span>
                    </div>
                    <span className="text-sm font-medium">€3,920</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm">Produktverkäufe</span>
                    </div>
                    <span className="text-sm font-medium">€2,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-sm">Behandlungen</span>
                    </div>
                    <span className="text-sm font-medium">€1,230</span>
                  </div>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div>
                <h3 className="font-medium mb-4">Ausgabenaufschlüsselung</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm">Produkte & Materialien</span>
                    </div>
                    <span className="text-sm font-medium">€2,150</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span className="text-sm">Personal</span>
                    </div>
                    <span className="text-sm font-medium">€1,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm">Betriebskosten</span>
                    </div>
                    <span className="text-sm font-medium">€680</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Finanzprognose</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Prognose für nächsten Monat</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Erwarteter Umsatz</span>
                    <span className="text-sm font-medium text-green-600">€13,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Erwartete Ausgaben</span>
                    <span className="text-sm font-medium text-red-600">€4,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Erwarteter Gewinn</span>
                    <span className="text-sm font-medium text-blue-600">€9,000</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Trends & Analysen</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Wachsendes Kundeninteresse</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Steigende Produktverkäufe</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm">Höhere Materialkosten</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 