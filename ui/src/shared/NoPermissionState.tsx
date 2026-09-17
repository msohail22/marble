import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

interface NoPermissionStateProps {
  title?: string;
  description?: string
}

export default function NoPermissionState(
  {
    title = "You don't have access to this page",
    description = "You don't have permission to view this. Contact your administrator if you think this is an issue"
  } : NoPermissionStateProps
) : ReactNode {
  return (
    <div className="">
      <div className="">
       <ShieldAlert /> 
    </div>
      <h2 className="">{title}</h2>
      <p className="">{description}</p>
    </div>
  )
}
