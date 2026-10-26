import { ReactNode } from "react";
import { Column, Grid } from "../layout_components/layout";

export default function GridSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Column as="section" gap={3}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <Grid cols={{ sm: 2, lg: 3, xl: 4 }} gap={3}>
        {children}
      </Grid>
    </Column>
  );
}
