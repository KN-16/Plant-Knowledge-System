import React, { useMemo } from "react";
import Select from "react-select";

const SmartSelect = ({
  options = [],
  value,
  onChange,
  onBlur, // Quan trọng: nhận prop onBlur từ React Hook Form
  placeholder,
  label = "mục",
  isDisabled,
  isNewable = true
}) => {
  // Option thêm mới
  const newOption = isNewable ? { value: "new", label: `+ Thêm ${label} mới...`, isNew: true } : null;

  // const finalOptions = useMemo(() => {
  //   // Luôn luôn append option "Thêm mới" vào cuối hoặc đầu tùy ý
  //   if (!options?.length) return [defaultOption, newOption];
  //   if (options.length <=6) return [defaultOption,...options, newOption];
  //   return [defaultOption,newOption, ...options ];
  // }, [options, label]);

  let finalOptions = [];
  if (!options?.length) 
    {finalOptions = isNewable ? [newOption] : []}
  else if (options.length <=6) 
    {finalOptions = isNewable ? [...options, newOption] : [...options] }
  else finalOptions = isNewable ? [newOption, ...options ] : [...options];


  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#198754" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(25, 135, 84, 0.25)" : "none",
      "&:hover": { borderColor: "#198754" }
    }),
    option: (base, { data, isFocused, isSelected }) => {
      if (data.isNew) {
        return {
          ...base,
          fontWeight: "bold",
          color: (isSelected || isFocused) ? "#ffffff" : "#0d6efd",
          backgroundColor: isSelected ? "#198754" : isFocused ? "#0d6efd" : "#e7f1ff",
          borderTop: "1px dashed #b6d4fe"
        };
      }
      // Option đang được chọn
      if (isSelected) {
        return {
          ...base,
          backgroundColor: "#198754",
          color: "white",
          fontWeight: "600"
        };
      }
      // return {
      //   ...base,
      //   backgroundColor: isFocused ? "#e9ecef" : "white",
      //   color: "#212529"
      // };
      // Option đang hover
  if (isFocused) {
    return {
      ...base,
      backgroundColor: "#e9ecef",
      color: "#212529"
    };
  }

  // Option bình thường
  return {
    ...base,
    backgroundColor: "white",
    color: "#212529"
  };
    }
  };

  return (
    <Select
      options={finalOptions}
      value={value}
      onChange={onChange}
      onBlur={onBlur} // Bắn sự kiện blur về cho RHF để trigger validate onTouched
      styles={customStyles}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isSearchable
      noOptionsMessage={() => "Không tìm thấy dữ liệu"}
      // Giúp RHF so sánh value object chính xác
      getOptionValue={(option) => option.value}
      getOptionLabel={(option) => option.label}
    />
  );
};

export default SmartSelect;