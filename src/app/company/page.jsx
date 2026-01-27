import { Suspense } from "react";
import SelectedCompanyClient from "./SelectCompanyClient";

export default function CompanyPage() {
  return (
    <Suspense fallback={<p className="mt-12 text-center">Loading…</p>}>
      <SelectedCompanyClient />
    </Suspense>
  );
}
