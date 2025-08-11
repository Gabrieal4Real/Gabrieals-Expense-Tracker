import { Transaction } from "@/app/data/TransactionItem";
import { useRouter } from "expo-router";

const router = useRouter();

export function navigateToEditTransaction(transaction: Transaction) {
  const serialized = JSON.stringify(transaction);
  const encoded = encodeURIComponent(serialized);

  router.push({
    pathname: "/features/editTransaction/view/EditTransactionScreen",
    params: { data: encoded },
  });
}

export function navigateToTravelTracking() {
  router.push({
    pathname: "/features/travelTracking/view/TravelTrackingScreen",
  });
}

export function navigateBack() {
  router.back();
}
