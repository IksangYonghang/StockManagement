
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const HideColumns = ({ columns, toggleColumnVisibility, close }) => {
  return (
    <div className="hide-columns">
      <button onClick={close}>Close</button>
      <form>
        <label>Filter Columns:</label>
        {columns.map((column, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={column.visible}
                onChange={() => toggleColumnVisibility(column.name)}
                name={column.name}
              />
            }
            label={column.name}
          />
        ))}
      </form>
    </div>
  );
};

export default HideColumns;
