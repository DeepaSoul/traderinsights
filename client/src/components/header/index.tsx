import React from "react";
import { dayBefore } from "../../utils/constants";

type HeaderComponentProps = {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
};

const HeaderComponent = ({ date, setDate }: HeaderComponentProps) => {
  return (
    <div className="header">
      <h1>Welcome to Trader Insights</h1>
      <input
        type="date"
        min={dayBefore.toDateString()}
        onChange={(value) => {
          setDate(value.target.value);
        }}
        value={date}
        defaultValue={date}
      />
    </div>
  );
};

export default HeaderComponent;
