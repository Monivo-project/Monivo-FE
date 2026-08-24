import { useState } from "react";

import SectionCard from "./SectionCard";
import Toggle from "./Toggle";

import {
  INITIAL_NOTIFICATIONS,
  type NotificationKey,
} from "../data/settingsData";

export default function NotificationSection() {
  const [items, setItems] = useState(
    INITIAL_NOTIFICATIONS,
  );

  const toggle = (
    key: NotificationKey,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item,
      ),
    );
  };

  return (
    <SectionCard>
      <h2 className="mb-5 text-base font-bold text-gray-900">
        알림 설정
      </h2>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div>
              <p className="font-medium text-gray-900">
                {item.title}
              </p>

              <p className="mt-0.5 text-sm text-gray-400">
                {item.description}
              </p>
            </div>

            <Toggle
              checked={item.enabled}
              onChange={() =>
                toggle(item.key)
              }
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}