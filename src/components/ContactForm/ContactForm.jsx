import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { selectContacts } from "../../redux/contactsSlice";
import { addContact } from "../../redux/contactsOps";
import styles from "./ContactForm.module.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const ContactForm = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);

  const formik = useFormik({
    initialValues: {
      name: "",
      number: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Must be at least 3 characters")
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      number: Yup.string()
        .matches(/^\d{3}-\d{3}-\d{4}$/, "Number must be in format 123-45-67")
        .required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const newContact = {
        name: values.name,
        number: values.number,
      };
      if (
        contacts.some(
          (contact) =>
            contact.name.toLowerCase() === newContact.name.toLowerCase()
        )
      ) {
        iziToast.error({
          title: "Error",
          message: `${newContact.name} is already in contacts.`,
          position: "topCenter",
          timeout: 5000,
          backgroundColor: "#F44336",
          titleColor: "#FFFFFF",
          messageColor: "#FFFFFF",
          titleSize: "24px",
          messageSize: "22px",
          class: styles.customToast,
        });
        return;
      }
      dispatch(addContact(newContact));
      resetForm();
    },
  });

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <div className={styles.inputCont}>
        <label className={styles.label} htmlFor="name">
          <input
            className={styles.input}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            placeholder="Ім'я"
          />
        </label>
      </div>
      {formik.touched.name && formik.errors.name ? (
        <div className={styles.errorMessage}>{formik.errors.name}</div>
      ) : null}
      <div className={styles.inputCont}>
        <label className={styles.label} htmlFor="number">
          <input
            className={styles.input}
            id="number"
            name="number"
            type="text"
            autoComplete="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.number}
            placeholder="Телефон"
          />
        </label>
      </div>
      {formik.touched.number && formik.errors.number ? (
        <div className={styles.errorMessage}>{formik.errors.number}</div>
      ) : null}

      <button className={styles.buttonForm} type="submit">
        Додати контакт
      </button>
    </form>
  );
};

export default ContactForm;
