import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Plus, Edit, Trash2, Calendar, Clock, Phone, Mail, MapPin, Star, History } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kunden verwalten</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Neuer Kunde
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Kundenliste</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Kunde suchen..."
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Client Card */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Sarah Schmidt</h3>
                      <p className="text-sm text-gray-500">Kunde seit: 2023</p>
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
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">+49 123 456789</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">sarah.s@email.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Berlin, DE</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="text-sm">VIP Kunde</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <History className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Letzter Besuch: 15.03.2024</span>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                      Details anzeigen
                    </button>
                  </div>
                </div>
              </div>

              {/* Another Client Card */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Michael Weber</h3>
                      <p className="text-sm text-gray-500">Kunde seit: 2022</p>
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
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">+49 987 654321</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">michael.w@email.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Hamburg, DE</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="text-sm">Stammkunde</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <History className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Letzter Besuch: 10.03.2024</span>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                      Details anzeigen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments & Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Termine & Statistiken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Today's Appointments */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Heutige Termine</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Sarah Schmidt</p>
                      <p className="text-xs text-gray-500">Färben & Schneiden</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">14:00</p>
                      <p className="text-xs text-gray-500">90 min</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Michael Weber</p>
                      <p className="text-xs text-gray-500">Haarschnitt</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">16:30</p>
                      <p className="text-xs text-gray-500">45 min</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  Alle Termine anzeigen
                </button>
              </div>

              {/* Customer Statistics */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Kundenstatistiken</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neue Kunden (März)</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Durchschnittliche Besuche</span>
                    <span className="text-sm font-medium">4.2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Treuequote</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  Detaillierte Statistiken
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 