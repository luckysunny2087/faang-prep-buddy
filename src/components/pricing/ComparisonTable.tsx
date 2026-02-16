import { Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type FeatureValue = boolean | string;

interface Feature {
  name: string;
  trial: FeatureValue;
  monthly: FeatureValue;
  yearly: FeatureValue;
}

const features: Feature[] = [
  { name: "AI Mock Interviews", trial: "5/day", monthly: "Unlimited", yearly: "Unlimited" },
  { name: "Featured Companies", trial: "20+", monthly: "70+", yearly: "70+" },
  { name: "Custom Companies", trial: false, monthly: true, yearly: true },
  { name: "Technical Questions", trial: true, monthly: true, yearly: true },
  { name: "Behavioral Questions", trial: true, monthly: true, yearly: true },
  { name: "System Design Questions", trial: false, monthly: true, yearly: true },
  { name: "Domain-Specific Questions", trial: false, monthly: true, yearly: true },
  { name: "Timed Simulations (30/60 min)", trial: false, monthly: true, yearly: true },
  { name: "Performance Analytics", trial: "Basic", monthly: "Detailed", yearly: "Detailed" },
  { name: "Resume & JD Tailored Questions", trial: false, monthly: true, yearly: true },
  { name: "Cover Letter Generator", trial: false, monthly: true, yearly: true },
  { name: "Interview History & Tracking", trial: false, monthly: true, yearly: true },
  { name: "Priority AI Response Speed", trial: false, monthly: true, yearly: true },
  { name: "Personalized Learning Roadmaps", trial: false, monthly: false, yearly: true },
  { name: "AI Resume Review & Tips", trial: false, monthly: false, yearly: true },
  { name: "Voice Interview Practice", trial: false, monthly: false, yearly: true },
  { name: "Export PDF Reports", trial: false, monthly: false, yearly: true },
  { name: "Expert Interview Guides", trial: false, monthly: false, yearly: true },
  { name: "Early Access to New Features", trial: false, monthly: false, yearly: true },
  { name: "Priority Email Support", trial: false, monthly: false, yearly: true },
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
              <TableCell className="text-center">{renderValue(feature.trial)}</TableCell>
              <TableCell className="text-center bg-primary/[0.03]">{renderValue(feature.monthly)}</TableCell>
              <TableCell className="text-center">{renderValue(feature.yearly)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default ComparisonTable;
