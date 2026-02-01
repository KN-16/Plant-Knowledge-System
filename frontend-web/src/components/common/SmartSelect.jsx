import React, { useMemo } from "react";
import Select from "react-select";

const SmartSelect = ({
  options = [],
  value,
  onChange,
  onBlur, // Quan trọng: nhận prop onBlur từ React Hook Form
  placeholder,
  label = "mục",
  isDisabled
}) => {
  // Option mặc định
  const defaultOption = { value: "", label: `Chọn ${label}...`, isDisabled: true };
  // Option thêm mới
  const newOption = { value: "new", label: `+ Thêm ${label} mới...`, isNew: true };

  // const finalOptions = useMemo(() => {
  //   // Luôn luôn append option "Thêm mới" vào cuối hoặc đầu tùy ý
  //   if (!options?.length) return [defaultOption, newOption];
  //   if (options.length <=6) return [defaultOption,...options, newOption];
  //   return [defaultOption,newOption, ...options ];
  // }, [options, label]);

  let finalOptions = [];
  if (!options?.length) finalOptions = [defaultOption, newOption]
  else if (options.length <=6) finalOptions = [defaultOption,...options, newOption] 
  else finalOptions = [defaultOption,newOption, ...options ];


  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#198754" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(25, 135, 84, 0.25)" : "none",
      "&:hover": { borderColor: "#198754" }
    }),
    option: (base, { data, isFocused }) => {
      if (data.isNew) {
        return {
          ...base,
          fontWeight: "bold",
          color: isFocused ? "white" : "#198754",
          backgroundColor: isFocused ? "#198754" : "#e8f5e9",
          borderTop: "1px solid #dee2e6"
        };
      }
      return {
        ...base,
        backgroundColor: isFocused ? "#e9ecef" : "white",
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