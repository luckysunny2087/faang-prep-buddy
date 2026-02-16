import { Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type FeatureValue = boolean | string;

interface Feature {
  name: string;
  basic: FeatureValue;
  pro: FeatureValue;
  elite: FeatureValue;
}

const features: Feature[] = [
  { name: "AI Mock Interviews", basic: "5/day", pro: "Unlimited", elite: "Unlimited" },
  { name: "Featured Companies", basic: "20+", pro: "70+", elite: "70+" },
  { name: "Custom Companies", basic: false, pro: true, elite: true },
  { name: "Technical Questions", basic: true, pro: true, elite: true },
  { name: "Behavioral Questions", basic: true, pro: true, elite: true },
  { name: "System Design Questions", basic: false, pro: true, elite: true },
  { name: "Domain-Specific Questions", basic: false, pro: true, elite: true },
  { name: "Timed Simulations (30/60 min)", basic: false, pro: true, elite: true },
  { name: "Performance Analytics", basic: "Basic", pro: "Detailed", elite: "Detailed" },
  { name: "Resume & JD Tailored Questions", basic: false, pro: true, elite: true },
  { name: "Cover Letter Generator", basic: false, pro: true, elite: true },
  { name: "Interview History & Tracking", basic: false, pro: true, elite: true },
  { name: "Priority AI Response Speed", basic: false, pro: true, elite: true },
  { name: "Personalized Learning Roadmaps", basic: false, pro: false, elite: true },
  { name: "AI Resume Review & Tips", basic: false, pro: false, elite: true },
  { name: "Voice Interview Practice", basic: false, pro: false, elite: true },
  { name: "Export PDF Reports", basic: false, pro: false, elite: true },
  { name: "Expert Interview Guides", basic: false, pro: false, elite: true },
  { name: "Early Access to New Features", basic: false, pro: false, elite: true },
  { name: "Priority Email Support", basic: false, pro: false, elite: true },
];

const renderValue = (value: FeatureValue) => {
  if (value === true) return <Check className="h-4 w-4 text-green-500 mx-auto" />;
  if (value === false) return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  return <span className="text-sm font-medium text-foreground">{value}</span>;
};

const ComparisonTable = () => (
  <div className="mt-24 max-w-4xl mx-auto">
    <h2 className="text-2xl font-display font-bold mb-8 text-center">
      Compare All Features
    </h2>
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[40%] font-semibold text-foreground">Feature</TableHead>
            <TableHead className="text-center font-semibold text-foreground">Basic</TableHead>
            <TableHead className="text-center font-semibold text-primary">Pro</TableHead>
            <TableHead className="text-center font-semibold text-foreground">Elite</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.name} className="hover:bg-muted/20">
              <TableCell className="text-sm text-foreground/80">{feature.name}</TableCell>
              <TableCell className="text-center">{renderValue(feature.basic)}</TableCell>
              <TableCell className="text-center bg-primary/[0.03]">{renderValue(feature.pro)}</TableCell>
              <TableCell className="text-center">{renderValue(feature.elite)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default ComparisonTable;
