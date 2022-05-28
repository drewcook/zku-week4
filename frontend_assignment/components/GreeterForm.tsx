import { SyntheticEvent, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const styles = {
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

const GreeterForm = (props: GreeterFormProps): JSX.Element => {
  const { onSubmit } = props;
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [continent, setContinent] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Log out the form data
    console.log({ firstName, lastName, city, continent, email });
    // Invoke the callback if one is passed in
    if (onSubmit) onSubmit();
  };

  return (
    <Container maxWidth="md">
      <Box sx={styles.wrapper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField
                variant="outlined"
                label="City of Residence"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="country-label">
                  Continent of Residence
                </InputLabel>
                <Select
                  labelId="country-label"
                  variant="outlined"
                  label="Continent of Residence"
                  value={continent}
                  onChange={(e) => setContinent(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="Africa">Africa</MenuItem>
                  <MenuItem value="Asia">Asia</MenuItem>
                  <MenuItem value="Australia">Australia</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="North America">North America</MenuItem>
                  <MenuItem value="South America">South America</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            variant="outlined"
            label="Email Address"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
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
    </Container>
  );
};

export default GreeterForm;
