import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Clock, Calendar, Phone, Mail, Edit, Trash2 } from "lucide-react";

export default function EmployeesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mitarbeiter verwalten</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          Neuer Mitarbeiter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Staff List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mitarbeiterliste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Employee Card */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Lisa Weber</h3>
                      <p className="text-sm text-gray-500">Friseurmeisterin</p>
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
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Mo - Fr: 09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">+49 123 456 789</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">lisa.weber@salon.de</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Seit 2020</span>
                  </div>
                </div>
              </div>

              {/* Another Employee Card */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Max Schmidt</h3>
                      <p className="text-sm text-gray-500">Friseur</p>
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
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Mo - Fr: 10:00 - 19:00</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">+49 987 654 321</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">max.schmidt@salon.de</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">Seit 2022</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Management */}
        <Card>
          <CardHeader>
            <CardTitle>Dienstpläne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Diese Woche</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Montag</span>
                    <span className="text-sm">09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dienstag</span>
                    <span className="text-sm">09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mittwoch</span>
                    <span className="text-sm">09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Donnerstag</span>
                    <span className="text-sm">09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Freitag</span>
                    <span className="text-sm">09:00 - 18:00</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  Dienstplan bearbeiten
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Urlaub & Abwesenheiten</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lisa Weber</span>
                    <span className="text-sm text-red-600">15. - 20. März</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Max Schmidt</span>
                    <span className="text-sm text-red-600">22. März</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  Abwesenheit eintragen
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 