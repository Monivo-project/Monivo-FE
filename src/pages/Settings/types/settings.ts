export type CategoryKey =
  | "food"
  | "transport"
  | "shopping"
  | "health"
  | "entertainment"
  | "housing"
  | "education"
  | "etc";

export type NotificationKey =
  | "anomaly"
  | "uncategorized"
  | "budgetOver";

export type AutoRule = {
  id: string;
  keywords: string[];
  category: CategoryKey;
};

export type Budget = {
  category: CategoryKey;
  amount: number;
};

export type Notification = {
  key: NotificationKey;
  title: string;
  description: string;
  enabled: boolean;
};