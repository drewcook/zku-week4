import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";

const styles = {
  loading: {
    minHeight: "317px", // match form height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    my: 4,
  },
  btn: {
    mt: 2,
  },
};

type GreeterFormProps = {
  onSubmit?: (...params: any[]) => any;
};

interface IGreeterFormValues {
  firstName: string;
  lastName: string;
  city: string;
  continent: string;
  email: string;
  greeting: string;
}

// Form Validation
const initialValues: IGreeterFormValues = {
  firstName: "",
  lastName: "",
  city: "",
  continent: "",
  email: "",
  greeting: "",
};
const validationSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(1, "Please enter a valid first name")
    .max(50, "First name is too long")
    .required("First name is required"),
  lastName: yup
    .string()
    .trim()
    .min(1, "Please enter a valid last name")
    .max(50, "First name is too long")
    .required("Last name is required"),
  city: yup
    .string()
    .trim()
    .min(3, "City should be at least 3 characters")
    .max(100, "City should not exceed 100 characters"),
  continent: yup
    .string()
    .trim()
    .min(3, "Please enter a valid contintent")
    .max(15, "Please enter a valid contintent"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),
  greeting: yup
    .string()
    .trim()
    .min(1, "Please enter a valid greeting")
    .max(31, "Greeting is too long") // must be 32 bytes max
    .required("Greeting is required"),
});

const GreeterForm = (props: GreeterFormProps): JSX.Element => {
  const { onSubmit } = props;

  const handleSubmitLogger = async (
    values: IGreeterFormValues,
    formikBag: FormikHelpers<IGreeterFormValues>
  ) => {
    try {
      // Log out the form data
      console.log(values);
      // Invoke the callback if one is passed in
      if (onSubmit) await onSubmit(values.greeting);
      formikBag.resetForm();
    } catch (e: any) {
      console.error(e);
    }
    // Set submitting state back
    formikBag.setSubmitting(false);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, formikBag) => {
      formikBag.setSubmitting(true);
      handleSubmitLogger(values, formikBag);
    },
  });

  return (
    <Container maxWidth="md">
      {isSubmitting ? (
        <Box sx={styles.loading}>
          <CircularProgress size={80} color="primary" />
        </Box>
      ) : (
        <Box sx={styles.wrapper}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="firstName"
                  variant="outlined"
                  label="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="lastName"
                  variant="outlined"
                  label="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <TextField
                  name="city"
                  variant="outlined"
                  label="City of Residence"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  error={touched.city && Boolean(errors.city)}
                  helperText={touched.city && errors.city}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="continent-label">
                    Continent of Residence
                  </InputLabel>
                  <Select
                    name="continent"
                    labelId="continent-label"
                    variant="outlined"
                    label="Continent of Residence"
                    value={values.continent}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.continent && Boolean(errors.continent)}
                    fullWidth
                  >
                    <MenuItem value="Africa">Africa</MenuItem>
                    <MenuItem value="Asia">Asia</MenuItem>
                    <MenuItem value="Australia">Australia</MenuItem>
                    <MenuItem value="Europe">Europe</MenuItem>
                    <MenuItem value="North America">North America</MenuItem>
                    <MenuItem value="South America">South America</MenuItem>
                  </Select>
                  <FormHelperText
                    variant="outlined"
                    error={touched.continent && Boolean(errors.continent)}
                  >
                    {errors.continent}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              name="email"
              variant="outlined"
              label="Email Address"
              value={values.email}
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              fullWidth
            />
            <TextField
              name="greeting"
              variant="outlined"
              label="Greeting"
              placeholder="Say something to the blockchain!"
              value={values.greeting}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              error={touched.greeting && Boolean(errors.greeting)}
              helperText={touched.greeting && errors.greeting}
              fullWidth
            />
            <Button
              sx={styles.btn}
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Greet
            </Button>
          </form>
        </Box>
      )}
    </Container>
  );
};

export default GreeterForm;
