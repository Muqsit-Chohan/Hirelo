import { MoreHorizontal, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

 function DropdownMenuDialog({appId , updateStatus, disabled = false}) {
   return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Update application status" disabled={disabled}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-36" align="end">

        <DropdownMenuItem onSelect={() => updateStatus(appId, "accepted")}>
          <Check className="w-4 h-4 text-green-700" /> Accept
        </DropdownMenuItem>

        {/* <DropdownMenuItem onSelect={() => updateStatus(appId, "pending")}> */}
          {/* Pending */}
        {/* </DropdownMenuItem> */}

        <DropdownMenuItem onSelect={() => updateStatus(appId, "rejected")}>
          <X className="w-4 h-4 text-red-600" /> Reject
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownMenuDialog;
