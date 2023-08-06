"use client";

import { Alert } from "@aws-amplify/ui-react";
import { ReactNode } from "react";

export default async function HelloWorld({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Alert
      variation="info"
      isDismissible={false}
      hasIcon={false}
      heading="Hello World!"
    >
      {children}
    </Alert>
  );
}
