import { MapPin, Home, Truck } from "lucide-react";
import EditableSection, { type FieldGroup } from "./EditableSection";

const defaultFields = [
  { key: "permanentAddress", label: "Permanent Address" },
  { key: "permanentCity", label: "City" },
  { key: "permanentState", label: "State" },
  { key: "permanentZip", label: "ZIP Code" },
  { key: "permanentCountry", label: "Country" },
  { key: "shippingAddress", label: "Shipping Address" },
  { key: "shippingCity", label: "City" },
  { key: "shippingState", label: "State" },
  { key: "shippingZip", label: "ZIP Code" },
  { key: "shippingCountry", label: "Country" },
];

const groups: FieldGroup[] = [
  {
    title: "Permanent Address",
    icon: Home,
    fields: [
      { key: "permanentAddress", label: "Address Line" },
      { key: "permanentCity", label: "City" },
      { key: "permanentState", label: "State" },
      { key: "permanentZip", label: "ZIP Code" },
      { key: "permanentCountry", label: "Country" },
    ],
  },
  {
    title: "Shipping Address",
    icon: Truck,
    fields: [
      { key: "shippingAddress", label: "Address Line" },
      { key: "shippingCity", label: "City" },
      { key: "shippingState", label: "State" },
      { key: "shippingZip", label: "ZIP Code" },
      { key: "shippingCountry", label: "Country" },
    ],
  },
];

const AddressesSection = () => (
  <EditableSection
    title="Addresses"
    subtitle="Permanent and shipping addresses for billing, delivery, and applications."
    icon={MapPin}
    firestoreKey="addresses"
    defaultFields={defaultFields}
    groups={groups}
  />
);

export default AddressesSection;
