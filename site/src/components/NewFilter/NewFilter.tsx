import { useTheme } from "@emotion/react";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import type { FC } from "react";

const inputHeight = 36;
const inputBorderRadius = 6;
const inputSidePadding = 12;

type NewFilterProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export const NewFilter: FC<NewFilterProps> = (props) => {
  const theme = useTheme();
  const { value, error, onChange } = props;
  const isEmpty = value.length === 0;

  const outlineCSS = (color: string) => ({
    outline: `2px solid ${color}`,
    outlineOffset: -1, // Overrides the border
  });

  return (
    <div
      css={{
        borderRadius: inputBorderRadius,
        border: `1px solid ${theme.palette.divider}`,
        height: inputHeight,
        padding: `0 ${inputSidePadding}px`,
        "&:focus-within": error ? "" : outlineCSS(theme.palette.primary.main),
        ...(error ? outlineCSS(theme.palette.error.main) : {}),
      }}
    >
      <InputBase
        startAdornment={
          <SearchOutlined
            role="presentation"
            css={{
              width: 14,
              height: 14,
              color: theme.palette.text.secondary,
              marginRight: inputSidePadding / 2,
            }}
          />
        }
        endAdornment={
          !isEmpty && (
            <Tooltip title="Clear filter">
              <IconButton
                size="small"
                onClick={() => {
                  onChange("");
                }}
              >
                <CloseOutlined
                  css={{
                    width: 14,
                    height: 14,
                    color: theme.palette.text.secondary,
                  }}
                />
                <span css={{ ...visuallyHidden }}>Clear filter</span>
              </IconButton>
            </Tooltip>
          )
        }
        fullWidth
        placeholder="Search..."
        css={{ fontSize: 14, height: "100%" }}
        value={value}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  );
};