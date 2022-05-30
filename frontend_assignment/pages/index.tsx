import detectEthereumProvider from "@metamask/detect-provider";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import Head from "next/head";
import React, { useState } from "react";
import { Contract, providers } from "ethers";
import Greeter from "artifacts/contracts/Greeters.sol/Greeters.json";
import styles from "../styles/Home.module.css";
import GreeterForm from "../components/GreeterForm";
import GreetingText from "../components/GreetingText";

export default function Home() {
  const [logs, setLogs] = useState("Connect your wallet and greet!");

  // Set up a shared contract instance to use throughout the UI
  const instance = new Contract(
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // local contract address
    Greeter.abi
  );
  const provider = new providers.JsonRpcProvider("http://localhost:8545");
  const contract = instance.connect(provider.getSigner());

  async function greet(greeting: string = "Hello World") {
    try {
      setLogs("Creating your Semaphore identity...");

      const provider = (await detectEthereumProvider()) as any;

      await provider.request({ method: "eth_requestAccounts" });

      const ethersProvider = new providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      const message = await signer.signMessage(
        "Sign this message to create your identity!"
      );

      const identity = new ZkIdentity(Strategy.MESSAGE, message);
      const identityCommitment = identity.genIdentityCommitment();
      const identityCommitments = await (
        await fetch("./identityCommitments.json")
      ).json();

      const merkleProof = generateMerkleProof(
        20,
        BigInt(0),
        identityCommitments,
        identityCommitment
      );

      setLogs("Creating your Semaphore proof...");

      const witness = Semaphore.genWitness(
        identity.getTrapdoor(),
        identity.getNullifier(),
        merkleProof,
        merkleProof.root,
        greeting
      );

      const { proof, publicSignals } = await Semaphore.genProof(
        witness,
        "./semaphore.wasm",
        "./semaphore_final.zkey"
      );
      const solidityProof = Semaphore.packToSolidityProof(proof);

      const response = await fetch("/api/greet", {
        method: "POST",
        body: JSON.stringify({
          greeting,
          nullifierHash: publicSignals.nullifierHash,
          solidityProof: solidityProof,
        }),
      });
      const data = await response.json();

      if (response.status === 500) {
        const errorMessage = await response.text();
        console.error(errorMessage);
        setLogs("Something went wrong, check the console");
      } else {
        // Display hash
        const { transactionHash } = data;
        setLogs(`Your anonymous onchain greeting tx - ${transactionHash}`);
      }
    } catch (e: any) {
      console.error(e);
      setLogs("Something went wrong, check the console");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Greetings</title>
        <meta
          name="description"
          content="A simple Next.js/Hardhat privacy application with Semaphore."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Greetings</h1>

        <p className={styles.description}>
          A simple Next.js/Hardhat privacy application with Semaphore.
        </p>

        <GreetingText contract={contract} />
        <GreeterForm onSubmit={greet} />

        <div className={styles.logs}>{logs}</div>
      </main>
    </div>
  );
}
