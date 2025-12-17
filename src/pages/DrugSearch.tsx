import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader, AlertCircle } from "lucide-react";

interface Drug {
  id?: number;
  drug_name: string;
  medical_condition: string;
  rating?: number;
  no_of_reviews?: number;
  rx_otc?: string;
  pregnancy_category?: string;
  activity?: string;
  medical_condition_description?: string;
  drug_link?: string;
}

interface Medicine {
  id?: number;
  name: string;
  price?: number;
  manufacturer_name?: string;
  type?: string;
  pack_size_label?: string;
  composition?: string;
}

export function DrugSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionQuery, setConditionQuery] = useState("");
  const [results, setResults] = useState<Drug[]>([]);
  const [medicineResults, setMedicineResults] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [error, setError] = useState("");

  const handleSearchDrugs = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a drug name");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/drugs/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.drugs || []);
      if (data.drugs?.length === 0) {
        setError(`No drugs found for "${searchQuery}"`);
      }
    } catch (err) {
      setError("Error searching drugs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCondition = async () => {
    if (!conditionQuery.trim()) {
      setError("Please enter a medical condition");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/drugs/condition?condition=${encodeURIComponent(conditionQuery)}`);
      const data = await response.json();
      setResults(data.drugs || []);
      if (data.drugs?.length === 0) {
        setError(`No drugs found for treating "${conditionQuery}"`);
      }
    } catch (err) {
      setError("Error searching by condition");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchIndianMedicines = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a medicine name");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/medicines-india/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setMedicineResults(data.medicines || []);
      if (data.medicines?.length === 0) {
        setError(`No Indian medicines found for "${searchQuery}"`);
      }
    } catch (err) {
      setError("Error searching medicines");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">💊 Drug & Medicine Search</h1>
          <p className="text-muted-foreground text-lg">
            Search our comprehensive database of drugs, medicines, and pharmaceutical information
          </p>
        </div>

        <Tabs defaultValue="search" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Drugs</TabsTrigger>
            <TabsTrigger value="condition">By Condition</TabsTrigger>
            <TabsTrigger value="india">Indian Medicines</TabsTrigger>
          </TabsList>

          {/* Search Drugs Tab */}
          <TabsContent value="search" className="space-y-4">
            <Card className="p-6">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter drug name (e.g., Aspirin, Ibuprofen)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchDrugs()}
                  className="flex-1"
                />
                <Button onClick={handleSearchDrugs} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {error && activeTab === "search" && (
              <Card className="p-4 border-destructive/50 bg-destructive/10">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-destructive">{error}</p>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((drug, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-2">{drug.drug_name}</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Condition:</span> {drug.medical_condition}
                    </p>
                    {drug.rating && (
                      <p>
                        <span className="font-semibold">⭐ Rating:</span> {drug.rating}/10 ({drug.no_of_reviews} reviews)
                      </p>
                    )}
                    {drug.rx_otc && (
                      <p>
                        <span className="font-semibold">Type:</span> {drug.rx_otc}
                      </p>
                    )}
                    {drug.pregnancy_category && (
                      <p>
                        <span className="font-semibold">Pregnancy:</span> {drug.pregnancy_category}
                      </p>
                    )}
                    {drug.activity && (
                      <p>
                        <span className="font-semibold">Activity:</span> {drug.activity}
                      </p>
                    )}
                    {drug.medical_condition_description && (
                      <p className="text-muted-foreground mt-3">
                        {drug.medical_condition_description.substring(0, 150)}...
                      </p>
                    )}
                  </div>
                  {drug.drug_link && (
                    <Button variant="outline" className="mt-4 w-full" asChild>
                      <a href={drug.drug_link} target="_blank" rel="noopener noreferrer">
                        More Info
                      </a>
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Search by Condition Tab */}
          <TabsContent value="condition" className="space-y-4">
            <Card className="p-6">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter medical condition (e.g., Headache, Fever, Acne)"
                  value={conditionQuery}
                  onChange={(e) => setConditionQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchCondition()}
                  className="flex-1"
                />
                <Button onClick={handleSearchCondition} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {error && activeTab === "condition" && (
              <Card className="p-4 border-destructive/50 bg-destructive/10">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-destructive">{error}</p>
                </div>
              </Card>
            )}

            <div className="space-y-3">
              {results.map((drug, idx) => (
                <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{drug.drug_name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{drug.medical_condition}</p>
                    </div>
                    <div className="text-right">
                      {drug.rating && (
                        <p className="text-lg font-bold">⭐ {drug.rating}</p>
                      )}
                      {drug.no_of_reviews && (
                        <p className="text-xs text-muted-foreground">{drug.no_of_reviews} reviews</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Indian Medicines Tab */}
          <TabsContent value="india" className="space-y-4">
            <Card className="p-6">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search Indian medicines (e.g., Crocin, Aspirin)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchIndianMedicines()}
                  className="flex-1"
                />
                <Button onClick={handleSearchIndianMedicines} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {error && activeTab === "india" && (
              <Card className="p-4 border-destructive/50 bg-destructive/10">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-destructive">{error}</p>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicineResults.map((medicine, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-2">{medicine.name}</h3>
                  <div className="space-y-2 text-sm">
                    {medicine.price && (
                      <p>
                        <span className="font-semibold">💰 Price:</span> ₹{medicine.price}
                      </p>
                    )}
                    {medicine.manufacturer_name && (
                      <p>
                        <span className="font-semibold">🏭 Manufacturer:</span> {medicine.manufacturer_name}
                      </p>
                    )}
                    {medicine.type && (
                      <p>
                        <span className="font-semibold">📦 Type:</span> {medicine.type}
                      </p>
                    )}
                    {medicine.pack_size_label && (
                      <p>
                        <span className="font-semibold">Size:</span> {medicine.pack_size_label}
                      </p>
                    )}
                    {medicine.composition && (
                      <p>
                        <span className="font-semibold">🔬 Composition:</span> {medicine.composition.substring(0, 100)}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {results.length > 0 && activeTab !== "india" && (
          <div className="mt-8 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm">
              Found <span className="font-bold">{results.length}</span> result(s). Ask the chatbot for more
              details about any drug!
            </p>
          </div>
        )}

        {medicineResults.length > 0 && activeTab === "india" && (
          <div className="mt-8 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm">
              Found <span className="font-bold">{medicineResults.length}</span> Indian medicine(s).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
