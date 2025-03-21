import {Pharmacy} from "@/lib/types/pharmacy";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Building2, Calendar, CheckCircle, CreditCard, Mail, MapPin, Phone, User, XCircle} from "lucide-react";
import {format} from "date-fns";

interface PharmacyOverviewProps {
    pharmacy: Pharmacy | null;
    isAdmin: boolean;
}

const PharmacyOverview: React.FC<PharmacyOverviewProps> = ({ pharmacy, isAdmin }) => {
  return (
      <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-green-500"/>
                          Pharmacy Details
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Name</div>
                          <div className="font-medium">{pharmacy?.name}</div>
                      </div>
                      <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Address</div>
                          <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5"/>
                              <span>
                                {pharmacy?.address.street}, {pharmacy?.address.city}
                            </span>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {isAdmin && (
                  <>
                      <Card>
                          <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                  <User className="h-5 w-5 text-blue-500"/>
                                  Contact Information
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                              <div className="space-y-2">
                                  <div className="text-sm text-muted-foreground">Owner</div>
                                  <div className="font-medium">{pharmacy?.userId.first_name}</div>
                              </div>
                              <div className="space-y-2">
                                  <div className="text-sm text-muted-foreground">Email</div>
                                  <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-muted-foreground"/>
                                      <a href={`mailto:${pharmacy?.userId.email}`} className="text-blue-600 hover:underline">
                                          {pharmacy?.userId.email}
                                      </a>
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <div className="text-sm text-muted-foreground">Phone</div>
                                  <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-muted-foreground"/>
                                      <a href={`tel:${pharmacy?.userId.phone_number}`} className="hover:underline">
                                          {pharmacy?.userId.phone_number}
                                      </a>
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <div className="text-sm text-muted-foreground">Card CIN</div>
                                  <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4 text-muted-foreground"/>
                                      <div className="font-medium">{pharmacy?.userId.cin_number}</div>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  </>
              )}
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-purple-500"/>
                          Business Hours
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-2">
                          {Object.entries(pharmacy.workingHours).map(([day, hours]) => (
                              <div key={day} className="flex justify-between">
                                  <span className="font-medium capitalize">{day}</span>
                                  <span>
                                    {hours.open === "Closed" ? "Closed" : `${hours.open} - ${hours.close}`}
                                </span>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-purple-500"/>
                          Verified At
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      {pharmacy?.verifiedAt ? (
                          <>
                              <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-4" />
                                  <span>{format(new Date(pharmacy?.verifiedAt), "PPP")}</span>
                              </div>
                          </>
                      ) : (
                          <>
                              <div className="flex items-center">
                                  <XCircle className="h-4 w-4 text-red-500 mr-4" />
                                  <span>Not Verified</span>
                              </div>
                          </>
                      )}
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Calendar className="text-sm text-muted-foreground"/>
                          Weekend Permanence
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      {pharmacy?.weekendPermanence ? (
                          <>
                              <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>Open on Weekends</span>
                              </div>
                          </>
                      ) : (
                          <>
                              <div className="flex items-center">
                                  <XCircle className="h-4 w-4 text-red-500 mr-4" />
                                  <span>Closed on Weekends</span>
                              </div>
                          </>
                      )}
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-purple-500"/>
                          Created At
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Date</div>
                          <div>{pharmacy?.createdAt && format(new Date(pharmacy.createdAt), "PPP")}</div>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </>
  )
};

export default PharmacyOverview;