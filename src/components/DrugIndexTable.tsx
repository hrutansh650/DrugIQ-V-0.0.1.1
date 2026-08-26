import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from 'lucide-react';
interface Drug {
  id: number;
  genericName: string;
  brandNames: string[];
  dosageForm: string;
  drugClass: string;
  description: string;
}
const drugData: Drug[] = [{
  id: 1,
  genericName: "Atorvastatin",
  brandNames: ["Lipitor", "Atorlip", "Storvas", "Tonact"],
  dosageForm: "Tablet, 10 mg",
  drugClass: "Statin",
  description: "High cholesterol treatment"
}, {
  id: 2,
  genericName: "Metformin",
  brandNames: ["Glucophage", "Glycomet", "Obimet", "Formet"],
  dosageForm: "Tablet, 500 mg",
  drugClass: "Biguanide",
  description: "Oral diabetes medication"
}, {
  id: 3,
  genericName: "Amlodipine",
  brandNames: ["Norvasc", "Amlip", "Stamlo", "Amtas"],
  dosageForm: "Tablet, 5 mg",
  drugClass: "Calcium channel blocker",
  description: "Hypertension, angina"
}, {
  id: 4,
  genericName: "Albuterol",
  brandNames: ["Ventolin", "Asthalin", "Salbutol"],
  dosageForm: "Inhaler, 90 mcg/actuation",
  drugClass: "Beta-2 agonist",
  description: "Bronchodilator for asthma"
}, {
  id: 5,
  genericName: "Losartan",
  brandNames: ["Cozaar", "Losium", "Losar"],
  dosageForm: "Tablet, 50 mg",
  drugClass: "Angiotensin II receptor blocker",
  description: "Hypertension treatment"
}];
const DrugIndexTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredDrugs = drugData.filter(drug => drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) || drug.brandNames.some(brand => brand.toLowerCase().includes(searchTerm.toLowerCase())) || drug.drugClass.toLowerCase().includes(searchTerm.toLowerCase()) || drug.description.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drug Index</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drugs..."
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
              <TableHead>Generic Name</TableHead>
              <TableHead>Brand Names</TableHead>
              <TableHead>Dosage Form</TableHead>
              <TableHead>Drug Class</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrugs.map((drug) => (
              <TableRow key={drug.id}>
                <TableCell className="font-medium">{drug.genericName}</TableCell>
                <TableCell>{drug.brandNames.join(', ')}</TableCell>
                <TableCell>{drug.dosageForm}</TableCell>
                <TableCell>{drug.drugClass}</TableCell>
                <TableCell>{drug.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
export default DrugIndexTable;