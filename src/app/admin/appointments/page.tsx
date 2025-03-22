import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Phone, Mail, Scissors } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Termine verwalten</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          Neuer Termin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Kalender</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Kalender wird geladen...</p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Heutige Termine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Appointment Item */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-primary mr-2" />
                    <span className="font-medium">09:00</span>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Bestätigt
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Anna Schmidt</span>
                </div>
                <div className="flex items-center mb-2">
                  <Scissors className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Haarschnitt & Färbung</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-sm text-primary hover:text-primary/80">
                    Bearbeiten
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Stornieren
                  </button>
                </div>
              </div>

              {/* Another Appointment */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-primary mr-2" />
                    <span className="font-medium">10:30</span>
                  </div>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Ausstehend
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Max Weber</span>
                </div>
                <div className="flex items-center mb-2">
                  <Scissors className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Barttrimmen</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-sm text-primary hover:text-primary/80">
                    Bearbeiten
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Stornieren
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Kommende Termine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Datum</th>
                  <th className="text-left py-3 px-4">Zeit</th>
                  <th className="text-left py-3 px-4">Kunde</th>
                  <th className="text-left py-3 px-4">Behandlung</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">23. März 2024</td>
                  <td className="py-3 px-4">14:00</td>
                  <td className="py-3 px-4">Sarah Müller</td>
                  <td className="py-3 px-4">Haarschnitt</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Bestätigt
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-primary hover:text-primary/80 mr-2">
                      Bearbeiten
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Stornieren
                    </button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">23. März 2024</td>
                  <td className="py-3 px-4">15:30</td>
                  <td className="py-3 px-4">Thomas Fischer</td>
                  <td className="py-3 px-4">Haarschnitt & Bart</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Ausstehend
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-primary hover:text-primary/80 mr-2">
                      Bearbeiten
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Stornieren
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 