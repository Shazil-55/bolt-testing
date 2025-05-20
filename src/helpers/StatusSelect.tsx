// StatusSelect.js

import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { UserStatus } from "./interfaces";

const StatusSelect = ({ label, value, onChange, menuItems , disabled = false }) => {
  return (
    <FormControl
      style={{
        width: "48%",
        marginTop: "35px",
        marginBottom: "15px",
      }}
    >

      <InputLabel>{label} {value}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Is Active"
        style={{ width: "100%" }}
        disabled = {disabled}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StatusSelect;
