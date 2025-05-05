import React, { useState } from "react"; 
export default function SelectInput({
  label,
  defaultSelect,
  data = [],
  handler,
  isMulti = false
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (item) => {
    if (isMulti) {
      const isSelected = selectedItems.some(selected => selected.value === item.value);
      let newSelected;
      
      if (isSelected) {
        newSelected = selectedItems.filter(selected => selected.value !== item.value);
      } else {
        newSelected = [...selectedItems, item];
      }
      
      setSelectedItems(newSelected);
      handler(newSelected);
    } else {
      handler({ option: item.option, value: item.value });
    }
  };

  return (
    <>
      <div className="form-style1">
        <label className="heading-color ff-heading fw500 mb10">{label}</label>
        <div className="bootselect-multiselect">
          <div className="dropdown bootstrap-select">
            <button
              type="button"
              className="btn dropdown-toggle btn-light"
              data-bs-toggle="dropdown"
            >
              <div className="filter-option">
                <div className="filter-option-inner">
                  <div className="filter-option-inner-inner">
                    {isMulti 
                      ? selectedItems.map(item => item.option).join(', ') || 'Select'
                      : defaultSelect.option
                    }
                  </div>
                </div>
              </div>
            </button>
            <div className="dropdown-menu">
              <div className="inner show" style={{ maxHeight: "300px", overflowX: "auto" }}>
                <ul className="dropdown-menu inner show">
                  {data?.map((item, i) => {
                    const isItemSelected = isMulti 
                      ? selectedItems.some(selected => selected.value === item.value)
                      : item.value === defaultSelect.value;

                    return (
                      <li key={i} className={isItemSelected ? "selected active" : ""}>
                        <a
                          onClick={() => handleSelect(item)}
                          className={`dropdown-item ${isItemSelected ? "active selected" : ""}`}
                        >
                          {isMulti && (
                            <input 
                              type="checkbox" 
                              checked={isItemSelected}
                              onChange={() => {}}
                              className="me-2"
                            />
                          )}
                          <span className="text">{item.option}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}