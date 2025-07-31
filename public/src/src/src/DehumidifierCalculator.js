import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";

const DehumidifierCalculator = () => {
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [waterClass, setWaterClass] = useState(2);
  const [ahamRating, setAhamRating] = useState(0);
  const [cfmRating, setCfmRating] = useState(0);
  const [dehusNeeded, setDehusNeeded] = useState(0);
  const [airMoversNeeded, setAirMoversNeeded] = useState(0);
  const [unitMetric, setUnitMetric] = useState(true);
  const [useDesiccant, setUseDesiccant] = useState(false);

  const classFactors = {
    1: 0.25,
    2: 0.5,
    3: 0.75,
    4: 1.0
  };

  const toFeet = (m) => m * 3.28084;

  const calculate = () => {
    const L = unitMetric ? toFeet(length) : length;
    const W = unitMetric ? toFeet(width) : width;
    const H = unitMetric ? toFeet(height) : height;

    const volume = L * W * H;
    const ppdRequired = volume * classFactors[waterClass];

    const dehus = useDesiccant
      ? Math.ceil(volume / cfmRating)
      : Math.ceil(ppdRequired / ahamRating);

    const floorArea = L * W;
    const airMovers = Math.ceil(floorArea / 10);

    setDehusNeeded(dehus);
    setAirMoversNeeded(airMovers);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Dehumidifier & Air Mover Calculation Report", 10, 10);
    doc.text(`Unit: ${unitMetric ? "Metric" : "Imperial"}`, 10, 20);
    doc.text(`Length: ${length} ${unitMetric ? "m" : "ft"}`, 10, 30);
    doc.text(`Width: ${width} ${unitMetric ? "m" : "ft"}`, 10, 40);
    doc.text(`Height: ${height} ${unitMetric ? "m" : "ft"}`, 10, 50);
    doc.text(`Class of Water Damage: ${waterClass}`, 10, 60);
    doc.text(`${useDesiccant ? "Desiccant CFM" : "AHAM Rating (L/day)"}: ${useDesiccant ? cfmRating : ahamRating}`, 10, 70);
    doc.text(`Dehumidifiers Needed: ${dehusNeeded}`, 10, 80);
    doc.text(`Air Movers Needed: ${airMoversNeeded}`, 10, 90);
    doc.save("dehumidifier_calculation.pdf");
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">Dehumidifier & Air Mover Calculator</h2>

        <div className="flex items-center gap-4">
          <Label>Use Metric Units</Label>
          <Switch checked={unitMetric} onCheckedChange={setUnitMetric} />
        </div>

        <div className="flex items-center gap-4">
          <Label>Using Desiccant</Label>
          <Switch checked={useDesiccant} onCheckedChange={setUseDesiccant} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Length ({unitMetric ? "m" : "ft"})</Label>
            <Input type="number" onChange={e => setLength(Number(e.target.value))} />
          </div>
          <div>
            <Label>Width ({unitMetric ? "m" : "ft"})</Label>
            <Input type="number" onChange={e => setWidth(Number(e.target.value))} />
          </div>
          <div>
            <Label>Height ({unitMetric ? "m" : "ft"})</Label>
            <Input type="number" onChange={e => setHeight(Number(e.target.value))} />
          </div>
          <div>
            <Label>Water Damage Class (1-4)</Label>
            <Input type="number" min={1} max={4} onChange={e => setWaterClass(Number(e.target.value))} />
          </div>

          {!useDesiccant ? (
            <div>
              <Label>Dehumidifier AHAM Rating (L/day)</Label>
              <Input type="number" onChange={e => setAhamRating(Number(e.target.value))} />
            </div>
          ) : (
            <div>
              <Label>Desiccant Dehumidifier CFM</Label>
              <Input type="number" onChange={e => setCfmRating(Number(e.target.value))} />
            </div>
          )}
        </div>

        <Button onClick={calculate}>Calculate</Button>

        <div className="pt-4">
          <p><strong>Dehumidifiers Needed:</strong> {dehusNeeded}</p>
          <p><strong>Air Movers Needed:</strong> {airMoversNeeded}</p>
        </div>

        <div className="pt-4">
          <Label>Notes / Export</Label>
          <Textarea value={`Dehumidifiers: ${dehusNeeded}\nAir Movers: ${airMoversNeeded}`} readOnly rows={3} />
          <Button onClick={exportPDF} className="mt-2">Export to PDF</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DehumidifierCalculator;
