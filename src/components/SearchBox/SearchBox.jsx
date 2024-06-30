import { useDispatch } from "react-redux";
import { changeFilter } from "../../redux/filtersSlice";
import styles from "./SearchBox.module.css";

const SearchBox = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(changeFilter(event.target.value));
  };

  return (
    <label className={styles.label}>
      <input
        type="text"
        onChange={handleChange}
        placeholder="Пошук контактів"
        className={styles.input}
      />
    </label>
  );
};

export default SearchBox;
