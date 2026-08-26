import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DrugBrand {
  id: string;
  category: string;
  generic_name: string;
  dosage_form: string;
  company: string;
  brand_name_1?: string;
  brand_name_2?: string;
  brand_name_3?: string;
  brand_name_4?: string;
  brand_name_5?: string;
  brand_name_6?: string;
  brand_name_7?: string;
  brand_name_8?: string;
  brand_name_9?: string;
  brand_name_10?: string;
  price_range_per_strip?: string;
}

const BrandInfoTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drugBrands, setDrugBrands] = useState<DrugBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDrugBrands();
  }, []);

  const fetchDrugBrands = async () => {
    try {
      // Table does not exist yet - return empty data
      setDrugBrands([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch drug brand data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAllBrandNames = (drug: DrugBrand) => {
    const brandNames = [
      drug.brand_name_1, drug.brand_name_2, drug.brand_name_3, 
      drug.brand_name_4, drug.brand_name_5, drug.brand_name_6,
      drug.brand_name_7, drug.brand_name_8, drug.brand_name_9, 
      drug.brand_name_10
    ].filter(Boolean);
    return brandNames.join(', ');
  };

  const filteredDrugs = drugBrands.filter(drug => 
    drug.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getAllBrandNames(drug).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading brand information...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Information</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by generic name, category, company, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Generic Name</TableHead>
              <TableHead>Dosage Form</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Brand Names</TableHead>
              <TableHead>Price Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrugs.map((drug) => (
              <TableRow key={drug.id}>
                <TableCell className="font-medium">{drug.category}</TableCell>
                <TableCell>{drug.generic_name}</TableCell>
                <TableCell>{drug.dosage_form}</TableCell>
                <TableCell>{drug.company}</TableCell>
                <TableCell>{getAllBrandNames(drug)}</TableCell>
                <TableCell>{drug.price_range_per_strip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BrandInfoTable;