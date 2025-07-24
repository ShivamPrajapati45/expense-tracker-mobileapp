import { CategoryType, ExpenseCategoriesType } from "@/utils/types";
import Setting from 'react-native-vector-icons/Ionicons'

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Groceries",
    value: "groceries",
    icon: <Setting name='home' color='white' size={28} />,
    bgColor: "#4B5563", // Deep Teal Green
  },
  rent: {
    label: "Rent",
    value: "rent",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#075985", // Dark Blue
  },
  utilities: {
    label: "Utilities",
    value: "utilities",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#ca8a04", // Dark Golden Brown
  },
  transportation: {
    label: "Transportation",
    value: "transportation",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#b45309", // Dark Orange-Red
  },
  entertainment: {
    label: "Entertainment",
    value: "entertainment",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#0f766e", // Darker Red-Brown
  },
  dining: {
    label: "Dining",
    value: "dining",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#be185d", // Dark Red
  },
  health: {
    label: "Health",
    value: "health",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#e11d48", // Dark Purple
  },
  insurance: {
    label: "Insurance",
    value: "insurance",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#404040", // Dark Gray
  },
  savings: {
    label: "Savings",
    value: "savings",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#065F46", // Deep Teal Green
  },
  clothing: {
    label: "Clothing",
    value: "clothing",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#7c3aed", // Dark Indigo
  },
  personal: {
    label: "Personal",
    value: "personal",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#a21caf", // Deep Pink
  },
  others: {
    label: "Others",
    value: "others",
    icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
    bgColor: "#525252", // Neutral Dark Gray
  },
};

export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: <Setting name='settings-sharp' className='' color={'white'} size={28} />,
  bgColor: "#16a34a", // Dark
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];
