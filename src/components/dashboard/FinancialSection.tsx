import { CreditCard, Landmark, Smartphone } from "lucide-react";
import EditableSection, { type FieldGroup } from "./EditableSection";

const defaultFields = [
  { key: "cardholderName", label: "Cardholder Name" },
  { key: "cardNumber", label: "Card Number" },
  { key: "cardExpiry", label: "Card Expiry (MM/YY)" },
  { key: "cardCvv", label: "CVV" },
  { key: "billingZip", label: "Billing ZIP Code" },
  { key: "bankName", label: "Bank Name" },
  { key: "accountNumber", label: "Account Number" },
  { key: "ifscCode", label: "IFSC Code" },
  { key: "upiId", label: "UPI ID" },
];

const groups: FieldGroup[] = [
  {
    title: "Card Details",
    icon: CreditCard,
    fields: [
      { key: "cardholderName", label: "Cardholder Name" },
      { key: "cardNumber", label: "Card Number" },
      { key: "cardExpiry", label: "Card Expiry (MM/YY)" },
      { key: "cardCvv", label: "CVV" },
      { key: "billingZip", label: "Billing ZIP Code" },
    ],
  },
  {
    title: "Bank & UPI",
    icon: Landmark,
    fields: [
      { key: "bankName", label: "Bank Name" },
      { key: "accountNumber", label: "Account Number" },
      { key: "ifscCode", label: "IFSC Code" },
      { key: "upiId", label: "UPI ID" },
    ],
  },
];

const FinancialSection = ({ highlightField }: { highlightField?: string | null }) => (
  <EditableSection
    title="Financial & Payments"
    subtitle="Card and bank details for shopping, billing, and payment forms."
    icon={CreditCard}
    firestoreKey="financial"
    defaultFields={defaultFields}
    groups={groups}
    highlightField={highlightField}
  />
);

export default FinancialSection;
