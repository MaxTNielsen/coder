import { createContext, type FC, type PropsWithChildren } from "react";
import { useQuery } from "react-query";
import { appearance } from "api/queries/appearance";
import { entitlements } from "api/queries/entitlements";
import { experiments } from "api/queries/experiments";
import type {
  AppearanceConfig,
  Entitlements,
  Experiments,
} from "api/typesGenerated";
import { Loader } from "components/Loader/Loader";
import { useAuthenticated } from "contexts/auth/RequireAuth";
import { useEmbeddedMetadata } from "hooks/useEmbeddedMetadata";

export interface DashboardValue {
  /**
   * @deprecated Do not add new usage of this value. It is being removed as part
   * of the multi-org work.
   */
  organizationId: string;
  entitlements: Entitlements;
  experiments: Experiments;
  appearance: AppearanceConfig;
}

export const DashboardContext = createContext<DashboardValue | undefined>(
  undefined,
);

export const DashboardProvider: FC<PropsWithChildren> = ({ children }) => {
  const { metadata } = useEmbeddedMetadata();
  const { user } = useAuthenticated();
  const entitlementsQuery = useQuery(entitlements(metadata.entitlements));
  const experimentsQuery = useQuery(experiments(metadata.experiments));
  const appearanceQuery = useQuery(appearance(metadata.appearance));

  const isLoading =
    !entitlementsQuery.data || !appearanceQuery.data || !experimentsQuery.data;

  if (isLoading) {
    return <Loader fullscreen />;
  }

  return (
    <DashboardContext.Provider
      value={{
        organizationId: user.organization_ids[0] ?? "default",
        entitlements: entitlementsQuery.data,
        experiments: experimentsQuery.data,
        appearance: appearanceQuery.data,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
