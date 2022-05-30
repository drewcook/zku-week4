import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Contract, utils } from "ethers";

const styles = {
  wrapper: {
    my: 3,
    textAlign: "center",
  },
};

type GreetingTextProps = {
  contract: Contract;
};

const GreetingText = ({ contract }: GreetingTextProps): JSX.Element => {
  const [greeting, setGreeting] = useState<string>("");

  // Set a listener to the contract's NewGreeting event on mount
  // Update the greeting text display with each new event's value
  const subscribeToGreeting = async () => {
    contract.on(contract.filters.NewGreeting(), (_greeting: string) => {
      setGreeting(utils.parseBytes32String(_greeting));
    });
  };

  useEffect(() => {
    subscribeToGreeting();
    return () => {
      contract.removeAllListeners(contract.filters.NewGreeting());
    };
  }, []);

  return (
    <Box sx={styles.wrapper}>
      <Typography variant="overline">Most Recent Greeting</Typography>
      <Typography>{greeting || "N/A"}</Typography>
    </Box>
  );
};

export default GreetingText;
