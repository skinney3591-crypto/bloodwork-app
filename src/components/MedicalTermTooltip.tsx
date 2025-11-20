import { useState } from 'react'
import { HelpCircle } from 'lucide-react'

// Dictionary of medical term definitions for patient education
export const medicalTermDefinitions: Record<string, { short: string; long: string }> = {
  // Lipid Panel
  'LDL Cholesterol': {
    short: '"Bad" cholesterol that can build up in arteries',
    long: 'Low-density lipoprotein (LDL) is often called "bad" cholesterol because high levels can lead to plaque buildup in arteries, increasing heart disease risk.'
  },
  'HDL Cholesterol': {
    short: '"Good" cholesterol that helps remove bad cholesterol',
    long: 'High-density lipoprotein (HDL) is called "good" cholesterol because it carries cholesterol away from arteries to the liver for removal from the body.'
  },
  'Total Cholesterol': {
    short: 'Sum of all cholesterol types in your blood',
    long: 'Total cholesterol includes LDL, HDL, and 20% of triglycerides. It gives an overall picture of cholesterol levels.'
  },
  'Triglycerides': {
    short: 'Type of fat in your blood from food',
    long: 'Triglycerides are fats from food that your body stores for energy. High levels increase risk of heart disease and pancreatitis.'
  },

  // Metabolic Panel
  'Glucose (Fasting)': {
    short: 'Blood sugar level after not eating',
    long: 'Fasting glucose measures blood sugar after 8+ hours without eating. High levels may indicate diabetes or prediabetes.'
  },
  'HbA1c': {
    short: '3-month average of blood sugar',
    long: 'Hemoglobin A1c shows average blood sugar over 2-3 months by measuring glucose attached to red blood cells. Used to diagnose and monitor diabetes.'
  },
  'Creatinine': {
    short: 'Waste product filtered by kidneys',
    long: 'Creatinine is a waste product from muscle activity. High levels may indicate kidney problems since healthy kidneys filter it out.'
  },
  'BUN': {
    short: 'Blood urea nitrogen - kidney function marker',
    long: 'Blood urea nitrogen measures waste product from protein breakdown. High levels may indicate kidney disease or dehydration.'
  },
  'eGFR': {
    short: 'Estimated kidney filtering rate',
    long: 'Estimated glomerular filtration rate shows how well kidneys filter blood. Lower numbers indicate reduced kidney function.'
  },

  // Vitamins & Minerals
  'Vitamin D': {
    short: 'Vitamin for bone health and immunity',
    long: 'Vitamin D helps absorb calcium for strong bones and supports immune function. Most people get it from sunlight exposure.'
  },
  'Vitamin B12': {
    short: 'Vitamin for nerves and blood cells',
    long: 'Vitamin B12 is essential for nerve function and red blood cell formation. Deficiency can cause fatigue and neurological problems.'
  },
  'Iron': {
    short: 'Mineral that carries oxygen in blood',
    long: 'Iron is needed to make hemoglobin in red blood cells that carry oxygen throughout the body. Low iron causes anemia.'
  },
  'Ferritin': {
    short: 'Protein that stores iron in your body',
    long: 'Ferritin is the main iron storage protein. Low ferritin indicates depleted iron stores even before anemia develops.'
  },

  // Thyroid
  'TSH': {
    short: 'Hormone that controls thyroid function',
    long: 'Thyroid-stimulating hormone tells the thyroid how much hormone to make. High TSH often means underactive thyroid; low TSH may mean overactive.'
  },
  'Free T4': {
    short: 'Active thyroid hormone in blood',
    long: 'Free thyroxine (T4) is the main hormone made by the thyroid. It controls metabolism, energy, and body temperature.'
  },
  'Free T3': {
    short: 'Most active form of thyroid hormone',
    long: 'Triiodothyronine (T3) is the most active thyroid hormone. The body converts T4 to T3 for use by cells.'
  },

  // Liver
  'ALT': {
    short: 'Liver enzyme - high means liver stress',
    long: 'Alanine aminotransferase is an enzyme mainly in the liver. High levels indicate liver damage or disease.'
  },
  'AST': {
    short: 'Enzyme found in liver and muscles',
    long: 'Aspartate aminotransferase is in the liver, heart, and muscles. High levels can indicate damage to these organs.'
  },

  // Blood Cells
  'Hemoglobin': {
    short: 'Protein in red blood cells carrying oxygen',
    long: 'Hemoglobin is the iron-containing protein in red blood cells that binds oxygen. Low levels indicate anemia.'
  },
  'Hematocrit': {
    short: 'Percentage of blood that is red blood cells',
    long: 'Hematocrit measures the proportion of red blood cells in your blood. Low levels suggest anemia; high levels may indicate dehydration.'
  },
  'WBC': {
    short: 'White blood cells - infection fighters',
    long: 'White blood cell count shows how many immune cells you have. High counts may indicate infection; low counts may indicate immune problems.'
  },
  'Platelets': {
    short: 'Blood cells that help with clotting',
    long: 'Platelets are cell fragments that help stop bleeding by forming clots. Low counts can cause excessive bleeding; high counts may increase clot risk.'
  },

  // Inflammation
  'CRP': {
    short: 'Marker for inflammation in the body',
    long: 'C-reactive protein rises when there is inflammation in the body. High levels are linked to heart disease and other conditions.'
  },
  'ESR': {
    short: 'How fast red blood cells settle - inflammation marker',
    long: 'Erythrocyte sedimentation rate measures how fast red blood cells settle in a tube. High rates suggest inflammation.'
  },
}

interface MedicalTermTooltipProps {
  term: string
  children?: React.ReactNode
  showIcon?: boolean
}

export default function MedicalTermTooltip({ term, children, showIcon = true }: MedicalTermTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const definition = medicalTermDefinitions[term]

  if (!definition) {
    return <>{children || term}</>
  }

  return (
    <span className="relative inline-flex items-center">
      <span
        className="cursor-help border-b border-dashed border-gray-400"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children || term}
      </span>
      {showIcon && (
        <HelpCircle
          className="h-4 w-4 ml-1 text-blue-500 cursor-help"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(!isOpen)}
        />
      )}

      {isOpen && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-72 p-3 bg-white border border-gray-300 rounded-lg shadow-xl">
          <p className="font-semibold text-gray-900 text-sm mb-1">{term}</p>
          <p className="text-sm text-gray-600">{definition.long}</p>
          <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-300" />
        </div>
      )}
    </span>
  )
}

// Simplified inline tooltip for use in lists
export function SimpleTooltip({ term }: { term: string }) {
  const definition = medicalTermDefinitions[term]

  if (!definition) {
    return <span>{term}</span>
  }

  return (
    <span className="group relative cursor-help">
      <span className="border-b border-dotted border-gray-400">{term}</span>
      <span className="invisible group-hover:visible absolute z-50 bottom-full left-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
        {definition.short}
      </span>
    </span>
  )
}
