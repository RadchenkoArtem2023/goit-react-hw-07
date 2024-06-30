// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addContact } from "../../redux/contactsSlice";
// import styles from "./ContactForm.module.css";

// const ContactsForm = () => {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const dispatch = useDispatch();

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     dispatch(addContact({ id: Date.now().toString(), name, phone }));
//     setName("");
//     setPhone("");
//   };

//   return (
//     <form onSubmit={handleSubmit} className={styles.form}>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Ім'я"
//         required
//       />
//       <input
//         type="text"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//         placeholder="Телефон"
//         required
//       />
//       <button type="submit" className={styles.button}>
//         Додати контакт
//       </button>
//     </form>
//   );
// };

// export default ContactsForm;
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
          Name
        </label>
        <input
          className={styles.input}
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
      </div>
      {formik.touched.name && formik.errors.name ? (
        <div className={styles.errorMessage}>{formik.errors.name}</div>
      ) : null}
      <div className={styles.inputCont}>
        <label className={styles.label} htmlFor="number">
          Number
        </label>
        <input
          className={styles.input}
          id="number"
          name="number"
          type="text"
          autoComplete="number"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.number}
        />
      </div>
      {formik.touched.number && formik.errors.number ? (
        <div className={styles.errorMessage}>{formik.errors.number}</div>
      ) : null}

      <button className={styles.buttonForm} type="submit">
        Add Contact
      </button>
    </form>
  );
};

export default ContactForm;
