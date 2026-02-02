import { Suspense } from "react";
import SelectedCompanyClient from "./SelectCompanyClient";

export default function CompanyPage() {
  return (
    <Suspense
      fallback={<p className="mt-12 text-center text-gray-500">Loading…</p>}
    >
      <SelectedCompanyClient />
    </Suspense>
  );
}
