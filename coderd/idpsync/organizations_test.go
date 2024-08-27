package idpsync

import (
	"testing"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/stretchr/testify/require"

	"cdr.dev/slog/sloggers/slogtest"
	"github.com/coder/coder/v2/coderd/entitlements"
	"github.com/coder/coder/v2/testutil"
)

func TestParseOrganizationClaims(t *testing.T) {
	t.Parallel()

	t.Run("SingleOrgDeployment", func(t *testing.T) {
		t.Parallel()

		s := NewAGPLSync(slogtest.Make(t, &slogtest.Options{}), entitlements.New(), SyncSettings{
			OrganizationField:         "",
			OrganizationMapping:       nil,
			OrganizationAssignDefault: true,
		})

		ctx := testutil.Context(t, testutil.WaitMedium)

		params, err := s.ParseOrganizationClaims(ctx, jwt.MapClaims{})
		require.Nil(t, err)

		require.Empty(t, params.Organizations)
		require.True(t, params.IncludeDefault)
		require.False(t, params.SyncEnabled)
	})

	t.Run("AGPL", func(t *testing.T) {
		t.Parallel()

		// AGPL has limited behavior
		s := NewAGPLSync(slogtest.Make(t, &slogtest.Options{}), entitlements.New(), SyncSettings{
			OrganizationField: "orgs",
			OrganizationMapping: map[string][]uuid.UUID{
				"random": {uuid.New()},
			},
			OrganizationAssignDefault: false,
		})

		ctx := testutil.Context(t, testutil.WaitMedium)

		params, err := s.ParseOrganizationClaims(ctx, jwt.MapClaims{})
		require.Nil(t, err)

		require.Empty(t, params.Organizations)
		require.False(t, params.IncludeDefault)
		require.False(t, params.SyncEnabled)
	})
}