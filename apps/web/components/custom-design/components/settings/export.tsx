import { exportToPdf } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const Export = () => (
  <div className="flex flex-col gap-3 py-3">
    <h3 className="text-[10px] uppercase">Action</h3>
    <Button variant="secondary" className="flex-1" onClick={exportToPdf}>
      Export to PDF
    </Button>
  </div>
);

export default Export;
