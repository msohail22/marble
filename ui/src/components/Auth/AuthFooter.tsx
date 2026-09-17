import type { ReactNode } from "react";

export default function AuthFooter() : ReactNode {
  return (
    <div className="absolute text-xs text-center bottom-6 text-muted-forground">
      <p>
        &copy: {new Date().getFullYear()} Marble. All rights reserved.
      </p>
    </div>
  )
}
