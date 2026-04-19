import React, { useMemo, useEffect } from "react";
import Select, { components } from "react-select";

// 1. TẠO CUSTOM MENU LIST ĐỂ CĂN GIỮA THANH CUỘN
const CustomMenuList = (props) => {
  const { innerRef, children } = props;

  useEffect(() => {
    // Tăng thời gian chờ lên 50ms để "đi sau, về trước", 
    // đảm bảo React-Select đã cuộn mặc định xong thì ta mới can thiệp đè lên.
    const timer = setTimeout(() => {
      if (innerRef.current) {
        // Tìm chính xác Option đang được chọn thông qua class
        const selectedEl = innerRef.current.querySelector('.rs__option--is-selected');
        
        if (selectedEl) {
          // Bỏ phép toán thủ công. Dùng API native của trình duyệt.
          // block: 'center' sẽ ép phần tử này nằm chính giữa vùng nhìn thấy!
          selectedEl.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <components.MenuList {...props}>
      {children}
    </components.MenuList>
  );
};

const SmartSelect = ({
  options = [],
  value,
  onChange,
  onBlur, 
  placeholder,
  label = "mục",
  isDisabled,
  isNewable = true,
  isNullable = false,
}) => {

  const finalOptions = useMemo(() => {
    const newOption = isNewable ? { value: "new", label: `+ Thêm ${label} mới...`, isNew: true } : null;
    const defaultOption = isNullable ? { value: null, label: `Chọn ${label}...`, isNew: false } : null;

    let arr = [];
    if (!options?.length) {
      arr = isNewable ? [newOption] : isNullable ? [defaultOption] : [];
    } else if (options.length <= 6) {
      arr = isNewable ? [...options, newOption] : isNullable ? [defaultOption, ...options] : [...options];
    } else {
      arr = isNewable ? [newOption, ...options] : isNullable ? [defaultOption, ...options] : [...options];
    }
    
    return arr.filter(Boolean);
  }, [options, label, isNewable, isNullable]);

  const currentValue = useMemo(() => {
    if (!value) return isNullable ? finalOptions.find(o => o.value === null) : null;
    return finalOptions.find(opt => opt?.value === value?.value) || value;
  }, [value, finalOptions, isNullable]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#198754" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(25, 135, 84, 0.25)" : "none",
      "&:hover": { borderColor: "#198754" }
    }),
    menu: (base) => ({
        ...base,
        zIndex: 9999 
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
      if (isSelected) {
        return {
          ...base,
          backgroundColor: "#198754",
          color: "white",
          fontWeight: "600"
        };
      }
      if (isFocused) {
        return {
          ...base,
          backgroundColor: "#e9ecef",
          color: "#212529"
        };
      }
      return {
        ...base,
        backgroundColor: "white",
        color: "#212529"
      };
    }
  };

  return (
    <Select
      // BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ BẮT CLASS Ở TRÊN
      classNamePrefix="rs"
      
      options={finalOptions}
      value={currentValue}
      onChange={onChange}
      onBlur={onBlur} 
      
      components={{ MenuList: CustomMenuList }}
      
      styles={customStyles}
      placeholder={isDisabled ? "" : placeholder}
      isDisabled={isDisabled}
      isSearchable
      noOptionsMessage={() => "Không tìm thấy dữ liệu"}
    />
  );
};

export default SmartSelect;
