import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const elements = [
    { symbol: "H", name: "Hydrogen", atomicNumber: 1, color: "bg-blue-200" },
    { symbol: "He", name: "Helium", atomicNumber: 2, color: "bg-yellow-200" },
    { symbol: "Li", name: "Lithium", atomicNumber: 3, color: "bg-red-200" },
    { symbol: "Be", name: "Beryllium", atomicNumber: 4, color: "bg-green-200" },
    { symbol: "B", name: "Boron", atomicNumber: 5, color: "bg-orange-200" },
    { symbol: "C", name: "Carbon", atomicNumber: 6, color: "bg-gray-200" },
    { symbol: "N", name: "Nitrogen", atomicNumber: 7, color: "bg-blue-300" },
    { symbol: "O", name: "Oxygen", atomicNumber: 8, color: "bg-red-300" },
    { symbol: "F", name: "Fluorine", atomicNumber: 9, color: "bg-green-300" },
    { symbol: "Ne", name: "Neon", atomicNumber: 10, color: "bg-purple-200" },
    { symbol: "Na", name: "Sodium", atomicNumber: 11, color: "bg-yellow-300" },
    { symbol: "Mg", name: "Magnesium", atomicNumber: 12, color: "bg-teal-200" },
    { symbol: "Al", name: "Aluminium", atomicNumber: 13, color: "bg-gray-300" },
    { symbol: "Si", name: "Silicon", atomicNumber: 14, color: "bg-orange-300" },
    { symbol: "P", name: "Phosphorus", atomicNumber: 15, color: "bg-purple-300" },
    { symbol: "S", name: "Sulfur", atomicNumber: 16, color: "bg-yellow-400" },
    { symbol: "Cl", name: "Chlorine", atomicNumber: 17, color: "bg-green-400" },
    { symbol: "Ar", name: "Argon", atomicNumber: 18, color: "bg-blue-400" },
    { symbol: "K", name: "Potassium", atomicNumber: 19, color: "bg-purple-400" },
    { symbol: "Ca", name: "Calcium", atomicNumber: 20, color: "bg-teal-300" },
    { symbol: "Sc", name: "Scandium", atomicNumber: 21, color: "bg-gray-400" },
    { symbol: "Ti", name: "Titanium", atomicNumber: 22, color: "bg-blue-500" },
    { symbol: "V", name: "Vanadium", atomicNumber: 23, color: "bg-red-500" },
    { symbol: "Cr", name: "Chromium", atomicNumber: 24, color: "bg-green-500" },
    { symbol: "Mn", name: "Manganese", atomicNumber: 25, color: "bg-purple-500" },
    { symbol: "Fe", name: "Iron", atomicNumber: 26, color: "bg-orange-400" },
    { symbol: "Co", name: "Cobalt", atomicNumber: 27, color: "bg-blue-600" },
    { symbol: "Ni", name: "Nickel", atomicNumber: 28, color: "bg-gray-500" },
    { symbol: "Cu", name: "Copper", atomicNumber: 29, color: "bg-yellow-500" },
    { symbol: "Zn", name: "Zinc", atomicNumber: 30, color: "bg-teal-400" },
    { symbol: "Ga", name: "Gallium", atomicNumber: 31, color: "bg-gray-600" },
    { symbol: "Ge", name: "Germanium", atomicNumber: 32, color: "bg-blue-700" },
    { symbol: "As", name: "Arsenic", atomicNumber: 33, color: "bg-red-600" },
    { symbol: "Se", name: "Selenium", atomicNumber: 34, color: "bg-green-600" },
    { symbol: "Br", name: "Bromine", atomicNumber: 35, color: "bg-orange-500" },
    { symbol: "Kr", name: "Krypton", atomicNumber: 36, color: "bg-purple-600" },
    { symbol: "Rb", name: "Rubidium", atomicNumber: 37, color: "bg-yellow-600" },
    { symbol: "Sr", name: "Strontium", atomicNumber: 38, color: "bg-teal-500" },
    { symbol: "Y", name: "Yttrium", atomicNumber: 39, color: "bg-gray-700" },
    { symbol: "Zr", name: "Zirconium", atomicNumber: 40, color: "bg-blue-800" },
    { symbol: "Nb", name: "Niobium", atomicNumber: 41, color: "bg-red-700" },
    { symbol: "Mo", name: "Molybdenum", atomicNumber: 42, color: "bg-green-700" },
    { symbol: "Tc", name: "Technetium", atomicNumber: 43, color: "bg-purple-700" },
    { symbol: "Ru", name: "Ruthenium", atomicNumber: 44, color: "bg-orange-600" },
    { symbol: "Rh", name: "Rhodium", atomicNumber: 45, color: "bg-blue-900" },
    { symbol: "Pd", name: "Palladium", atomicNumber: 46, color: "bg-gray-800" },
    { symbol: "Ag", name: "Silver", atomicNumber: 47, color: "bg-yellow-700" },
    { symbol: "Cd", name: "Cadmium", atomicNumber: 48, color: "bg-teal-600" },
    { symbol: "In", name: "Indium", atomicNumber: 49, color: "bg-gray-900" },
    { symbol: "Sn", name: "Tin", atomicNumber: 50, color: "bg-blue-1000" },
    { symbol: "Sb", name: "Antimony", atomicNumber: 51, color: "bg-red-800" },
    { symbol: "Te", name: "Tellurium", atomicNumber: 52, color: "bg-green-800" },
    { symbol: "I", name: "Iodine", atomicNumber: 53, color: "bg-purple-800" },
    { symbol: "Xe", name: "Xenon", atomicNumber: 54, color: "bg-orange-700" },
    { symbol: "Cs", name: "Cesium", atomicNumber: 55, color: "bg-yellow-800" },
    { symbol: "Ba", name: "Barium", atomicNumber: 56, color: "bg-teal-700" },
    { symbol: "La", name: "Lanthanum", atomicNumber: 57, color: "bg-gray-1000" },
    { symbol: "Ce", name: "Cerium", atomicNumber: 58, color: "bg-blue-1100" },
    { symbol: "Pr", name: "Praseodymium", atomicNumber: 59, color: "bg-red-900" },
    { symbol: "Nd", name: "Neodymium", atomicNumber: 60, color: "bg-green-900" },
    { symbol: "Pm", name: "Promethium", atomicNumber: 61, color: "bg-purple-900" },
    { symbol: "Sm", name: "Samarium", atomicNumber: 62, color: "bg-orange-800" },
    { symbol: "Eu", name: "Europium", atomicNumber: 63, color: "bg-yellow-900" },
    { symbol: "Gd", name: "Gadolinium", atomicNumber: 64, color: "bg-teal-800" },
    { symbol: "Tb", name: "Terbium", atomicNumber: 65, color: "bg-gray-1100" },
    { symbol: "Dy", name: "Dysprosium", atomicNumber: 66, color: "bg-blue-1200" },
    { symbol: "Ho", name: "Holmium", atomicNumber: 67, color: "bg-red-1000" },
    { symbol: "Er", name: "Erbium", atomicNumber: 68, color: "bg-green-1000" },
    { symbol: "Tm", name: "Thulium", atomicNumber: 69, color: "bg-purple-1000" },
    { symbol: "Yb", name: "Ytterbium", atomicNumber: 70, color: "bg-orange-900" },
    { symbol: "Lu", name: "Lutetium", atomicNumber: 71, color: "bg-yellow-1000" },
    { symbol: "Hf", name: "Hafnium", atomicNumber: 72, color: "bg-teal-900" },
    { symbol: "Ta", name: "Tantalum", atomicNumber: 73, color: "bg-gray-1200" },
    { symbol: "W", name: "Tungsten", atomicNumber: 74, color: "bg-blue-1300" },
    { symbol: "Re", name: "Rhenium", atomicNumber: 75, color: "bg-red-1100" },
    { symbol: "Os", name: "Osmium", atomicNumber: 76, color: "bg-green-1100" },
    { symbol: "Ir", name: "Iridium", atomicNumber: 77, color: "bg-purple-1100" },
    { symbol: "Pt", name: "Platinum", atomicNumber: 78, color: "bg-orange-1000" },
    { symbol: "Au", name: "Gold", atomicNumber: 79, color: "bg-yellow-1100" },
    { symbol: "Hg", name: "Mercury", atomicNumber: 80, color: "bg-teal-1000" },
    { symbol: "Tl", name: "Thallium", atomicNumber: 81, color: "bg-gray-1300" },
    { symbol: "Pb", name: "Lead", atomicNumber: 82, color: "bg-blue-1400" },
    { symbol: "Bi", name: "Bismuth", atomicNumber: 83, color: "bg-red-1200" },
    { symbol: "Po", name: "Polonium", atomicNumber: 84, color: "bg-green-1200" },
    { symbol: "At", name: "Astatine", atomicNumber: 85, color: "bg-purple-1200" },
    { symbol: "Rn", name: "Radon", atomicNumber: 86, color: "bg-orange-1100" },
    { symbol: "Fr", name: "Francium", atomicNumber: 87, color: "bg-yellow-1200" },
    { symbol: "Ra", name: "Radium", atomicNumber: 88, color: "bg-teal-1100" },
    { symbol: "Ac", name: "Actinium", atomicNumber: 89, color: "bg-gray-1400" },
    { symbol: "Th", name: "Thorium", atomicNumber: 90, color: "bg-blue-1500" },
    { symbol: "Pa", name: "Protactinium", atomicNumber: 91, color: "bg-red-1300" },
    { symbol: "U", name: "Uranium", atomicNumber: 92, color: "bg-green-1300" },
    { symbol: "Np", name: "Neptunium", atomicNumber: 93, color: "bg-purple-1300" },
    { symbol: "Pu", name: "Plutonium", atomicNumber: 94, color: "bg-orange-1200" },
    { symbol: "Am", name: "Americium", atomicNumber: 95, color: "bg-yellow-1300" },
    { symbol: "Cm", name: "Curium", atomicNumber: 96, color: "bg-teal-1200" },
    { symbol: "Bk", name: "Berkelium", atomicNumber: 97, color: "bg-gray-1500" },
    { symbol: "Cf", name: "Californium", atomicNumber: 98, color: "bg-blue-1600" },
    { symbol: "Es", name: "Einsteinium", atomicNumber: 99, color: "bg-red-1400" },
    { symbol: "Fm", name: "Fermium", atomicNumber: 100, color: "bg-green-1400" },
    { symbol: "Md", name: "Mendelevium", atomicNumber: 101, color: "bg-purple-1400" },
    { symbol: "No", name: "Nobelium", atomicNumber: 102, color: "bg-orange-1300" },
    { symbol: "Lr", name: "Lawrencium", atomicNumber: 103, color: "bg-yellow-1400" },
    { symbol: "Rf", name: "Rutherfordium", atomicNumber: 104, color: "bg-teal-1300" },
    { symbol: "Db", name: "Dubnium", atomicNumber: 105, color: "bg-gray-1600" },
    { symbol: "Sg", name: "Seaborgium", atomicNumber: 106, color: "bg-blue-1700" },
    { symbol: "Bh", name: "Bohrium", atomicNumber: 107, color: "bg-red-1500" },
    { symbol: "Hs", name: "Hassium", atomicNumber: 108, color: "bg-green-1500" },
    { symbol: "Mt", name: "Meitnerium", atomicNumber: 109, color: "bg-purple-1500" },
    { symbol: "Ds", name: "Darmstadtium", atomicNumber: 110, color: "bg-orange-1400" },
    { symbol: "Rg", name: "Roentgenium", atomicNumber: 111, color: "bg-yellow-1500" },
    { symbol: "Cn", name: "Copernicium", atomicNumber: 112, color: "bg-teal-1400" },
    { symbol: "Nh", name: "Nihonium", atomicNumber: 113, color: "bg-gray-1700" },
    { symbol: "Fl", name: "Flerovium", atomicNumber: 114, color: "bg-blue-1800" },
    { symbol: "Mc", name: "Moscovium", atomicNumber: 115, color: "bg-red-1600" },
    { symbol: "Lv", name: "Livermorium", atomicNumber: 116, color: "bg-green-1600" },
    { symbol: "Ts", name: "Tennessine", atomicNumber: 117, color: "bg-purple-1600" },
    { symbol: "Og", name: "Oganesson", atomicNumber: 118, color: "bg-orange-1500" },
];

const Element = ({ symbol, name, atomicNumber, color, onClick }) => (
  <Card
    className={`w-12 h-12 sm:w-16 sm:h-16 ${color} cursor-pointer transition-transform hover:scale-105`}
    onClick={onClick}
  >
    <CardContent className="p-1 text-center">
      <div className="text-xs sm:text-sm font-bold">{symbol}</div>
      <div className="text-xs">{atomicNumber}</div>
    </CardContent>
  </Card>
);

const ElementDetails = ({ element, onClose }) => (
  <Dialog open={!!element} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{element?.name}</DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <p>Symbol: {element?.symbol}</p>
        <p>Atomic Number: {element?.atomicNumber}</p>
        {/* Add more properties here */}
      </div>
    </DialogContent>
  </Dialog>
);

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState(null);

  return (
    <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1 p-4">
      {elements.map((element) => (
        <Element
          key={element.symbol}
          {...element}
          onClick={() => setSelectedElement(element)}
        />
      ))}
      <ElementDetails
        element={selectedElement}
        onClose={() => setSelectedElement(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Periodic Table</h1>
      <PeriodicTable />
    </div>
  );
}
